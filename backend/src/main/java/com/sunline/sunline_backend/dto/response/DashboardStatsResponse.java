package com.sunline.sunline_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalMenuItems;
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long preparingOrders;
    private long readyOrders;
    private long outForDeliveryOrders;
    private long deliveredOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long totalReservations;
}
