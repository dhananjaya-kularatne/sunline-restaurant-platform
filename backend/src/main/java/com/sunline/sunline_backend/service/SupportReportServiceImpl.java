package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.SupportReportDto;
import com.sunline.sunline_backend.entity.SupportReport;
import com.sunline.sunline_backend.repository.SupportReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportReportServiceImpl implements SupportReportService {

    private final SupportReportRepository supportReportRepository;

    @Override
    public SupportReport createSupportReport(SupportReportDto dto) {
        SupportReport report = SupportReport.builder()
                .fullName(dto.getFullName())
                .emailAddress(dto.getEmailAddress())
                .category(dto.getCategory())
                .orderId(dto.getOrderId())
                .description(dto.getDescription())
                .build();
                
        return supportReportRepository.save(report);
    }
    
    @Override
    public List<SupportReport> getUserReports(String emailAddress) {
        return supportReportRepository.findByEmailAddressOrderByCreatedAtDesc(emailAddress);
    }

    @Override
    public List<SupportReport> getAllReports() {
        return supportReportRepository.findByHiddenFromAdminFalseOrderByCreatedAtDesc();
    }

    @Override
    public void deleteSupportReport(Long id) {
        supportReportRepository.deleteById(id);
    }

    @Override
    public SupportReport updateReportStatus(Long id, String status) {
        SupportReport report = supportReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        return supportReportRepository.save(report);
    }

    @Override
    public void hideReportFromAdmin(Long id) {
        SupportReport report = supportReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setHiddenFromAdmin(true);
        supportReportRepository.save(report);
    }
}
