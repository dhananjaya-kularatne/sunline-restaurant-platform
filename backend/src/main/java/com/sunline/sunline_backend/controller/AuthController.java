package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.LoginRequest;
import com.sunline.sunline_backend.dto.request.RegisterRequest;
import com.sunline.sunline_backend.dto.response.AuthResponse;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.security.JwtTokenProvider;
import com.sunline.sunline_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(loginRequest.getEmail());

        User user = userService.findByEmail(loginRequest.getEmail());

        return ResponseEntity.ok(new AuthResponse(jwt, user.getRole().name(), user.getName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok("User registered successfully");
    }
}
