package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.response.SalesReportResponse;
import com.sunline.sunline_backend.dto.response.TopSellingItemDto;
import com.sunline.sunline_backend.entity.Order;
import com.sunline.sunline_backend.entity.OrderItem;
import com.sunline.sunline_backend.entity.OrderStatus;
import com.sunline.sunline_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminReportServiceImpl implements AdminReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public SalesReportResponse generateMonthlySalesReport(int year, int month) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1);
        List<OrderStatus> statuses = Arrays.asList(
            OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, 
            OrderStatus.READY, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED, 
            OrderStatus.COMPLETED
        );

        List<Order> orders = orderRepository.findOrdersForReport(startDate, endDate, statuses);

        BigDecimal totalRevenue = BigDecimal.ZERO;
        Map<String, Integer> itemQuantities = new HashMap<>();

        for (Order order : orders) {
            totalRevenue = totalRevenue.add(order.getTotalPrice());
            for (OrderItem item : order.getItems()) {
                String itemName = item.getMenuItem().getName();
                itemQuantities.put(itemName, itemQuantities.getOrDefault(itemName, 0) + item.getQuantity());
            }
        }

        List<TopSellingItemDto> topItems = itemQuantities.entrySet().stream()
                .map(e -> new TopSellingItemDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingInt(TopSellingItemDto::getQuantity).reversed())
                .limit(5)
                .collect(Collectors.toList());

        return SalesReportResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(orders.size())
                .topSellingItems(topItems)
                .build();
    }
}
