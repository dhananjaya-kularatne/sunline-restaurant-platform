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

    private final SupportReportRepository repository;

    @Override
    public SupportReport createSupportReport(SupportReportDto dto) {
        SupportReport report = SupportReport.builder()
                .fullName(dto.getFullName())
                .emailAddress(dto.getEmailAddress())
                .category(dto.getCategory())
                .orderId(dto.getOrderId())
                .description(dto.getDescription())
                .build();
                
        return repository.save(report);
    }
    
    @Override
    public List<SupportReport> getUserReports(String emailAddress) {
        return repository.findByEmailAddressOrderByCreatedAtDesc(emailAddress);
    }

    @Override
    public List<SupportReport> getAllReports() {
        return repository.findByHiddenFromAdminFalseOrderByCreatedAtDesc();
    }

    @Override
    public void deleteSupportReport(Long id) {
        SupportReport report = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        // Get current user roles
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            // Soft delete for Admin
            report.setHiddenFromAdmin(true);
            repository.save(report);
        } else {
            // Hard delete for Customer
            repository.delete(report);
        }
    }

    @Override
    public SupportReport updateReportStatus(Long id, String status) {
        SupportReport report = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        return repository.save(report);
    }
}
