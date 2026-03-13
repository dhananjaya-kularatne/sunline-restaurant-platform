package com.sunline.sunline_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {

    @NotBlank(message = "Caption is required")
    private String caption;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private List<String> taggedItems;
}
