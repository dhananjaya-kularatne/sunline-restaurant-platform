package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.request.CreatePostRequest;
import com.sunline.sunline_backend.dto.response.FoodPostResponse;
import com.sunline.sunline_backend.entity.FoodPost;
import com.sunline.sunline_backend.entity.PostReaction;
import com.sunline.sunline_backend.entity.ReactionType;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.FoodPostRepository;
import com.sunline.sunline_backend.repository.PostReactionRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class FoodPostService {

    private final FoodPostRepository foodPostRepository;
    private final UserRepository userRepository;
    private final PostReactionRepository postReactionRepository;

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
        return toResponse(saved, userId);
    }

    @Transactional(readOnly = true)
    public List<FoodPostResponse> getAllPosts(Long userId) {
        return foodPostRepository.findAllActivePosts()
                .stream()
                .map(post -> toResponse(post, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodPostResponse reactToPost(Long userId, Long postId, ReactionType reactionType) {
        foodPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<PostReaction> existing = postReactionRepository.findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            PostReaction reaction = existing.get();
            if (reaction.getReactionType() == reactionType) {
                // Toggle off
                postReactionRepository.delete(reaction);
            } else {
                // Change type
                reaction.setReactionType(reactionType);
                postReactionRepository.save(reaction);
            }
        } else {
            // New reaction
            FoodPost post = foodPostRepository.findById(postId).get();
            PostReaction reaction = PostReaction.builder()
                    .user(user)
                    .post(post)
                    .reactionType(reactionType)
                    .build();
            postReactionRepository.save(reaction);
        }

        // Fetch fresh post with eagerly loaded taggedItems
        FoodPost updatedPost = foodPostRepository.findByIdWithTags(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Return updated post data
        return toResponse(updatedPost, userId);
    }

    private FoodPostResponse toResponse(FoodPost post, Long currentUserId) {
        List<PostReaction> reactions = postReactionRepository.findByPostId(post.getId());
        
        // Initialize all 5 keys to 0
        Map<String, Long> reactionCounts = new LinkedHashMap<>();
        for (ReactionType type : ReactionType.values()) {
            reactionCounts.put(type.name(), 0L);
        }
        
        // Count actual reactions
        reactions.forEach(r -> 
            reactionCounts.merge(r.getReactionType().name(), 1L, Long::sum)
        );

        String currentUserReaction = null;
        if (currentUserId != null) {
            currentUserReaction = reactions.stream()
                    .filter(r -> r.getUser().getId().equals(currentUserId))
                    .map(r -> r.getReactionType().name())
                    .findFirst()
                    .orElse(null);
        }

        return FoodPostResponse.builder()
                .id(post.getId())
                .author(FoodPostResponse.AuthorInfo.builder()
                        .id(post.getAuthor().getId())
                        .name(post.getAuthor().getName())
                        .profilePicture(post.getAuthor().getProfilePicture())
                        .email(post.getAuthor().getEmail())
                        .build())
                .caption(post.getCaption())
                .imageUrl(post.getImageUrl())
                .taggedItems(post.getTaggedItems())
                .createdAt(post.getCreatedAt())
                .reactionCounts(reactionCounts)
                .currentUserReaction(currentUserReaction)
                .build();
    }

    @Transactional(readOnly = true)
    public List<FoodPostResponse> getPostsByUsername(String username) {
        return foodPostRepository.findActivePostsByUsername(username)
                .stream()
                .map(post -> toResponse(post, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removePost(Long postId) {
        FoodPost post = foodPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setRemoved(true);
        foodPostRepository.save(post);
    }
}
