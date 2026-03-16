package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.SupportReportDto;
import com.sunline.sunline_backend.entity.SupportReport;
import com.sunline.sunline_backend.service.SupportReportService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support-reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SupportReportController {

    private final SupportReportService supportReportService;

    @PostMapping
    public ResponseEntity<SupportReport> createReport(@Valid @RequestBody SupportReportDto dto) {
        SupportReport createdReport = supportReportService.createSupportReport(dto);
        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
    }

    @GetMapping("/user/{emailAddress:.+}")
    public ResponseEntity<List<SupportReport>> getUserReports(@PathVariable String emailAddress) {
        List<SupportReport> reports = supportReportService.getUserReports(emailAddress);
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        supportReportService.deleteSupportReport(id);
        return ResponseEntity.noContent().build();
    }
}
