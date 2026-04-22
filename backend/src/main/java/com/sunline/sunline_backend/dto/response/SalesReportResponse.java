package com.sunline.sunline_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportResponse {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private List<TopSellingItemDto> topSellingItems;
}
