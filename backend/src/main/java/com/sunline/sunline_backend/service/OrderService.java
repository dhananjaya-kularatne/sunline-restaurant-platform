package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.OrderDto;
import com.sunline.sunline_backend.dto.PlaceOrderRequest;
import java.util.List;

public interface OrderService {
    OrderDto placeOrder(String userEmail, PlaceOrderRequest request);
    List<OrderDto> getMyOrders(String userEmail);
    OrderDto cancelOrder(Long orderId, String userEmail);
    List<OrderDto> getAllOrders();
}
