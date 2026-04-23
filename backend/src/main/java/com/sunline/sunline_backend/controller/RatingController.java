package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.RatingRequest;
import com.sunline.sunline_backend.dto.response.RatingResponse;
import com.sunline.sunline_backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponse> submitRating(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.submitRating(userDetails.getUsername(), request));
    }

    @GetMapping("/menu-item/{id}")
    public ResponseEntity<List<RatingResponse>> getRatingsByMenuItem(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getRatingsByMenuItem(id));
    }

    @GetMapping("/menu-item/{id}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long id) {
        return ResponseEntity.ok(ratingService.getAverageRating(id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<RatingResponse>> getUserRatings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ratingService.getUserRatings(userDetails.getUsername()));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RatingResponse>> getAllRatings() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ratingService.deleteRating(id, userDetails.getUsername(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
