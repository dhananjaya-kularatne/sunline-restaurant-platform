package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.request.RatingRequest;
import com.sunline.sunline_backend.dto.response.RatingResponse;
import com.sunline.sunline_backend.entity.MenuItem;
import com.sunline.sunline_backend.entity.Rating;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.exception.ResourceNotFoundException;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import com.sunline.sunline_backend.repository.OrderRepository;
import com.sunline.sunline_backend.repository.RatingRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponse submitRating(String userEmail, RatingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));

        // Validation 1: Has ordered the item and it's delivered/completed
        boolean hasOrdered = orderRepository.hasUserOrderedItemWithStatus(userEmail, request.getMenuItemId());
        if (!hasOrdered) {
            throw new IllegalStateException("You can only rate items you have ordered and had delivered.");
        }

        // Validation 2: Already rated?
        if (ratingRepository.existsByUserAndMenuItem(user, menuItem)) {
            // For now, we don't implement update, so we throw error
            throw new IllegalStateException("You have already rated this item.");
        }

        Rating rating = Rating.builder()
                .user(user)
                .menuItem(menuItem)
                .stars(request.getStars())
                .comment(request.getComment())
                .build();

        Rating savedRating = ratingRepository.save(rating);

        return mapToResponse(savedRating);
    }

    public List<RatingResponse> getRatingsByMenuItem(Long menuItemId) {
        return ratingRepository.findByMenuItemId(menuItemId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long menuItemId) {
        Double avg = ratingRepository.getAverageRating(menuItemId);
        return avg != null ? avg : 0.0;
    }

    public Long getRatingCount(Long menuItemId) {
        return ratingRepository.countByMenuItemId(menuItemId);
    }

    private RatingResponse mapToResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .menuItemId(rating.getMenuItem().getId())
                .userName(rating.getUser().getName())
                .stars(rating.getStars())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
