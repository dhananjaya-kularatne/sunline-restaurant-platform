package com.sunline.sunline_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {
    private Long id;
    private Long menuItemId;
    private String userName;
    private Integer stars;
    private String comment;
    private LocalDateTime createdAt;
}
