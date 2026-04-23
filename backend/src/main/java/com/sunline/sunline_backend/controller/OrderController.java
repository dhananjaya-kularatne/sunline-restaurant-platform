package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.OrderDto;
import com.sunline.sunline_backend.dto.PlaceOrderRequest;
import com.sunline.sunline_backend.dto.StatusUpdateDto;
import com.sunline.sunline_backend.entity.OrderStatus;
import com.sunline.sunline_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PlaceOrderRequest request) {
        String userEmail = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(orderService.placeOrder(userEmail, request));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getMyOrders(userDetails.getUsername()));
    }

    @GetMapping("/kitchen")
    @PreAuthorize("hasRole('KITCHEN') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getKitchenOrders() {
        return ResponseEntity.ok(orderService.getKitchenOrders());
    }

    @GetMapping("/delivery")
    @PreAuthorize("hasRole('DELIVERY') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getDeliveryOrders() {
        return ResponseEntity.ok(orderService.getDeliveryOrders());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.cancelOrder(id, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('KITCHEN') or hasRole('DELIVERY') or hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDto statusDto) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, OrderStatus.valueOf(statusDto.getStatus())));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
