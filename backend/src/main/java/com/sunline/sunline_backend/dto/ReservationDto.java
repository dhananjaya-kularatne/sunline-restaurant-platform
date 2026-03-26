package com.sunline.sunline_backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDto {
    private Long id;
    private String customerEmail;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime reservationTime;
    private Integer guestCount;
    private String specialRequest;
    private String status;
}
