package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.SupportReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportReportRepository extends JpaRepository<SupportReport, Long> {
}
