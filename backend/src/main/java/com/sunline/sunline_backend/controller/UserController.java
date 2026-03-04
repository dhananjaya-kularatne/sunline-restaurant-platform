package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.UpdateProfileRequest;
import com.sunline.sunline_backend.dto.response.UserResponse;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(mapToResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        User user = userService.updateProfile(authentication.getName(), request.getName(), request.getBio());
        return ResponseEntity.ok(mapToResponse(user));
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {
        String fileName = userService.saveProfilePicture(authentication.getName(), file);
        return ResponseEntity.ok(fileName);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole().name())
                .active(user.getActive() == null || user.getActive())
                .build();
    }
}
