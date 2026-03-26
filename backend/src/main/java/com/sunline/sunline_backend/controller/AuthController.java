package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.ForgotPasswordRequest;
import com.sunline.sunline_backend.dto.request.LoginRequest;
import com.sunline.sunline_backend.dto.request.RegisterRequest;
import com.sunline.sunline_backend.dto.request.ResetPasswordRequest;
import com.sunline.sunline_backend.dto.response.AuthResponse;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.security.JwtTokenProvider;
import com.sunline.sunline_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public AuthController() {
        super();
    }

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = tokenProvider.generateToken(request.getEmail());
        User user = userService.findByEmail(request.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getName(), user.getEmail()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.createPasswordResetToken(request.getEmail());
        return ResponseEntity.ok("Reset link sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful");
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        userService.validateResetToken(token);
        return ResponseEntity.ok("Valid");
    }
}
