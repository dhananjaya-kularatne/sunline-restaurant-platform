package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.SupportReportDto;
import com.sunline.sunline_backend.dto.StatusUpdateDto;
import com.sunline.sunline_backend.entity.SupportReport;
import com.sunline.sunline_backend.service.SupportReportService;
import jakarta.validation.Valid;
import java.util.List;
import java.lang.String;
import java.lang.Long;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support-reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
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

    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SupportReport>> getAllReports() {
        List<SupportReport> reports = supportReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        supportReportService.hideReportFromAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SupportReport> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateDto statusDto) {
        if (statusDto == null || statusDto.getStatus() == null) {
            return ResponseEntity.badRequest().build();
        }
        SupportReport updated = supportReportService.updateReportStatus(id, statusDto.getStatus());
        return ResponseEntity.ok(updated);
    }
}
