package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.ReservationDto;
import com.sunline.sunline_backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationDto> createReservation(@RequestBody ReservationDto reservationDto) {
        return ResponseEntity.ok(reservationService.createReservation(reservationDto));
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationDto>> getMyReservations(@RequestParam String email) {
        return ResponseEntity.ok(reservationService.getReservationsByEmail(email));
    }
}
