package com.sunline.sunline_backend.dto;

import com.sunline.sunline_backend.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private Long userId;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
