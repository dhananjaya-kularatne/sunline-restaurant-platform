package com.sunline.sunline_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FoodPostResponse {
    private Long id;
    private AuthorInfo author;
    private String imageUrl;
    private String caption;
    private List<String> taggedItems;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class AuthorInfo {
        private Long id;
        private String name;
        private String profilePicture;
    }
}
