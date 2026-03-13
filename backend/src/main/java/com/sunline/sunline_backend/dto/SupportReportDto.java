package com.sunline.sunline_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportReportDto {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email Address is required")
    @Email(message = "Invalid email format")
    private String emailAddress;

    @NotBlank(message = "Category is required")
    private String category;

    private String orderId;

    @NotBlank(message = "Description is required")
    private String description;
}
