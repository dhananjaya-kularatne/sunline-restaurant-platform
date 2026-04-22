package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.response.SalesReportResponse;

public interface AdminReportService {
    SalesReportResponse generateMonthlySalesReport(int year, int month);
}
