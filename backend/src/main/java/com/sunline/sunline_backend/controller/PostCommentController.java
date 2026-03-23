package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.CommentRequest;
import com.sunline.sunline_backend.dto.response.CommentResponse;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.UserRepository;
import com.sunline.sunline_backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feed/posts/{postId}/comments")
@RequiredArgsConstructor
public class PostCommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = null;
        if (userDetails != null) {
            currentUserId = userRepository.findByEmail(userDetails.getUsername())
                    .map(u -> u.getId())
                    .orElse(null);
        }
        return ResponseEntity.ok(commentService.getComments(postId, currentUserId));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CommentRequest request) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(commentService.addComment(postId, user.getId(), request.getContent()));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
