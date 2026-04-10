package com.sunline.sunline_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private BigDecimal totalPrice;
    private List<OrderItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequest {
        private Long menuItemId;
        private Integer quantity;
        private BigDecimal price;
        private String specialInstructions;
    }
}
