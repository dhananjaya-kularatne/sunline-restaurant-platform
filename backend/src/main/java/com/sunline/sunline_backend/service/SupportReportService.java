package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.SupportReportDto;
import com.sunline.sunline_backend.entity.SupportReport;

public interface SupportReportService {
    SupportReport createSupportReport(SupportReportDto dto);
}
