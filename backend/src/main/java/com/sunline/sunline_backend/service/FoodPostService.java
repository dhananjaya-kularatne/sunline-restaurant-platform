package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.request.CreatePostRequest;
import com.sunline.sunline_backend.dto.response.FoodPostResponse;
import com.sunline.sunline_backend.entity.FoodPost;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.FoodPostRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FoodPostService {

        private final FoodPostRepository foodPostRepository;
        private final UserRepository userRepository;

        @Transactional
        public FoodPostResponse createPost(Long userId, CreatePostRequest request) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                FoodPost foodPost = FoodPost.builder()
                                .author(user)
                                .caption(request.getCaption())
                                .imageUrl(request.getImageUrl())
                                .taggedItems(request.getTaggedItems())
                                .build();

                FoodPost saved = foodPostRepository.save(foodPost);
                return toResponse(saved);
        }

        private FoodPostResponse toResponse(FoodPost post) {
                return FoodPostResponse.builder()
                                .id(post.getId())
                                .author(FoodPostResponse.AuthorInfo.builder()
                                                .id(post.getAuthor().getId())
                                                .name(post.getAuthor().getName())
                                                .build())
                                .caption(post.getCaption())
                                .imageUrl(post.getImageUrl())
                                .taggedItems(post.getTaggedItems())
                                .createdAt(post.getCreatedAt())
                                .build();
        }
}
