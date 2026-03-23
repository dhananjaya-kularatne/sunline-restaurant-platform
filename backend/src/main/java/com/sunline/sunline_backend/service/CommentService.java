package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.response.CommentResponse;
import com.sunline.sunline_backend.entity.FoodPost;
import com.sunline.sunline_backend.entity.PostComment;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.FoodPostRepository;
import com.sunline.sunline_backend.repository.PostCommentRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final PostCommentRepository postCommentRepository;
    private final FoodPostRepository foodPostRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId, Long currentUserId) {
        if (postId == null) return List.of();
        return postCommentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(c -> toResponse(c, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(Long postId, Long userId, String content) {
        Objects.requireNonNull(postId, "postId must not be null");
        Objects.requireNonNull(userId, "userId must not be null");
        Objects.requireNonNull(content, "content must not be null");

        FoodPost post = foodPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostComment comment = PostComment.builder()
                .post(post)
                .author(user)
                .content(content)
                .build();

        PostComment saved = postCommentRepository.save(Objects.requireNonNull(comment));
        return toResponse(saved, userId);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        PostComment comment = postCommentRepository.findByIdAndAuthorId(commentId, userId)
                .orElseThrow(() -> new RuntimeException("Comment not found or you are not the author"));
        postCommentRepository.delete(Objects.requireNonNull(comment));
    }

    private CommentResponse toResponse(PostComment comment, Long currentUserId) {
        return CommentResponse.builder()
                .id(comment.getId())
                .author(CommentResponse.AuthorInfo.builder()
                        .id(comment.getAuthor().getId())
                        .name(comment.getAuthor().getName())
                        .profilePicture(comment.getAuthor().getProfilePicture())
                        .build())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .isAuthor(currentUserId != null && currentUserId.equals(comment.getAuthor().getId()))
                .build();
    }
}
