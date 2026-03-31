package com.sunline.sunline_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private String menuItemImage;
    private Integer quantity;
    private BigDecimal price;
    private String specialInstructions;
}
