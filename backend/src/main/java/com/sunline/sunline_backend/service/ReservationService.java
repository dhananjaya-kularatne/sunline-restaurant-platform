package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.ReservationDto;
import com.sunline.sunline_backend.entity.Reservation;
import com.sunline.sunline_backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public ReservationDto createReservation(ReservationDto reservationDto) {
        Reservation reservation = Reservation.builder()
                .customerEmail(reservationDto.getCustomerEmail())
                .reservationDate(reservationDto.getReservationDate())
                .reservationTime(reservationDto.getReservationTime())
                .guestCount(reservationDto.getGuestCount())
                .specialRequest(reservationDto.getSpecialRequest())
                .status("PENDING")
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return mapToDto(savedReservation);
    }

    public List<ReservationDto> getReservationsByEmail(String email) {
        return reservationRepository.findByCustomerEmailOrderByCreatedAtDesc(email).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ReservationDto confirmReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus("CONFIRMED");
        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToDto(updatedReservation);
    }

    public ReservationDto markReserved(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus("RESERVED");
        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToDto(updatedReservation);
    }

    public ReservationDto cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus("CANCELLED");
        Reservation updatedReservation = reservationRepository.save(reservation);
        return mapToDto(updatedReservation);
    }

    public long countAllReservations() {
        return reservationRepository.count();
    }

    private ReservationDto mapToDto(Reservation reservation) {
        return ReservationDto.builder()
                .id(reservation.getId())
                .customerEmail(reservation.getCustomerEmail())
                .reservationDate(reservation.getReservationDate())
                .reservationTime(reservation.getReservationTime())
                .guestCount(reservation.getGuestCount())
                .specialRequest(reservation.getSpecialRequest())
                .status(reservation.getStatus())
                .build();
    }
}
