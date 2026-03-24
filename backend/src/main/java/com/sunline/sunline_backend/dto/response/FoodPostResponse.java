package com.sunline.sunline_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodPostResponse {
    private Long id;
    private AuthorInfo author;
    private String imageUrl;
    private String caption;
    private List<String> taggedItems;
    private LocalDateTime createdAt;
    
    // SN-19 Reactions
    private Map<String, Long> reactionCounts;
    private String currentUserReaction;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorInfo {
        private Long id;
        private String name;
        private String profilePicture;
        private String email;
    }
}
