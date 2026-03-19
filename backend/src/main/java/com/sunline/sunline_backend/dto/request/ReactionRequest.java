package com.sunline.sunline_backend.dto.request;

import com.sunline.sunline_backend.entity.ReactionType;
import lombok.Data;

@Data
public class ReactionRequest {
    private ReactionType reactionType;
}
