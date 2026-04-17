package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.SupportReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportReportRepository extends JpaRepository<SupportReport, Long> {
    List<SupportReport> findByEmailAddressOrderByCreatedAtDesc(String emailAddress);
    
    List<SupportReport> findByHiddenFromAdminFalseOrderByCreatedAtDesc();

    long countByStatus(String status);
}
