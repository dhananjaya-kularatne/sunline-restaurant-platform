package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.OrderDto;
import com.sunline.sunline_backend.dto.OrderItemDto;
import com.sunline.sunline_backend.dto.PlaceOrderRequest;
import com.sunline.sunline_backend.entity.Order;
import com.sunline.sunline_backend.entity.OrderItem;
import com.sunline.sunline_backend.entity.OrderStatus;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import com.sunline.sunline_backend.repository.OrderRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    @Transactional
    public OrderDto placeOrder(String userEmail, PlaceOrderRequest request) {
        log.info("Placing order for user: {}", userEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .totalPrice(request.getTotalPrice())
                .status(OrderStatus.PENDING)
                .build();

        for (PlaceOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItemRepository.findById(itemReq.getMenuItemId())
                            .orElseThrow(() -> new RuntimeException("Menu item not found")))
                    .quantity(itemReq.getQuantity())
                    .price(itemReq.getPrice())
                    .specialInstructions(itemReq.getSpecialInstructions())
                    .build();
            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Order saved with ID: {}", savedOrder.getId());
        return mapToDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders(String userEmail) {
        log.info("Fetching orders for user: {}", userEmail);
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<Order> orders = orderRepository.findByUserWithItems(user);
            log.info("Found {} orders for user {}", orders.size(), userEmail);
            return orders.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching orders for user: " + userEmail, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public OrderDto cancelOrder(Long orderId, String userEmail) {
        log.info("Cancelling order ID: {} for user: {}", orderId, userEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return mapToDto(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        log.info("Fetching all orders for admin");
        return orderRepository.findAllWithItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .fullName(order.getFullName())
                .email(order.getEmail())
                .phone(order.getPhone())
                .address(order.getAddress())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(item -> 
                        OrderItemDto.builder()
                                .id(item.getId())
                                .menuItemId(item.getMenuItem().getId())
                                .menuItemName(item.getMenuItem().getName())
                                .menuItemImage(item.getMenuItem().getImageUrl())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .specialInstructions(item.getSpecialInstructions())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
