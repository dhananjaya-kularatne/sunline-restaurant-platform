package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    List<Reservation> findAllByOrderByCreatedAtDesc();
}
