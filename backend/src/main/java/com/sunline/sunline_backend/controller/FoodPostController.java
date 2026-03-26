package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.CreatePostRequest;
import com.sunline.sunline_backend.dto.request.ReactionRequest;
import com.sunline.sunline_backend.dto.response.FoodPostResponse;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.UserRepository;
import com.sunline.sunline_backend.service.FoodPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FoodPostController {

    private final FoodPostService foodPostService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            String originalFilename = file.getOriginalFilename();
            String filename = UUID.randomUUID().toString() + "_" + originalFilename;

            Path uploadPath = Paths.get("uploads").toAbsolutePath();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/" + filename);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Could not upload file: " + e.getMessage());
        }
    }

    @PostMapping("/posts")
    public ResponseEntity<FoodPostResponse> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePostRequest request) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FoodPostResponse response = foodPostService.createPost(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<FoodPostResponse>> getFeed(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = null;
        if (userDetails != null) {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElse(null);
            if (user != null) {
                userId = user.getId();
            }
        }
        return ResponseEntity.ok(foodPostService.getAllPosts(userId));
    }

    @PostMapping("/posts/{postId}/reactions")
    public ResponseEntity<FoodPostResponse> reactToPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ReactionRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FoodPostResponse response = foodPostService.reactToPost(user.getId(), postId, request.getReactionType());
        return ResponseEntity.ok(response);
    }
}
