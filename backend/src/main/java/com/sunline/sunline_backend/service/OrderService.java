package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.OrderDto;
import com.sunline.sunline_backend.dto.PlaceOrderRequest;
import com.sunline.sunline_backend.entity.OrderStatus;
import java.util.List;

public interface OrderService {
    OrderDto placeOrder(String userEmail, PlaceOrderRequest request);
    List<OrderDto> getMyOrders(String userEmail);
    OrderDto cancelOrder(Long orderId, String userEmail);
    OrderDto updateOrderStatus(Long orderId, OrderStatus status);
    List<OrderDto> getAllOrders();
    List<OrderDto> getKitchenOrders();
    List<OrderDto> getDeliveryOrders();
    long countOrdersByStatus(OrderStatus status);
    long countAllOrders();
}
