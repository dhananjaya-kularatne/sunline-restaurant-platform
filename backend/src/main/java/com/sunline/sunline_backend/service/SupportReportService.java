package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.SupportReportDto;
import com.sunline.sunline_backend.entity.SupportReport;

import java.util.List;

public interface SupportReportService {
    SupportReport createSupportReport(SupportReportDto dto);
    List<SupportReport> getUserReports(String emailAddress);
    void deleteSupportReport(Long id);
}
