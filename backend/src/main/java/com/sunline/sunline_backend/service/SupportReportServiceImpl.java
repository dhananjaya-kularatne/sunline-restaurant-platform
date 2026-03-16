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
    public void deleteSupportReport(Long id) {
        repository.deleteById(id);
    }
}
