package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    @Query("SELECT c FROM PostComment c JOIN FETCH c.author WHERE c.post.id = :postId ORDER BY c.createdAt ASC")
    List<PostComment> findByPostIdOrderByCreatedAtAsc(@Param("postId") Long postId);

    long countByPostId(Long postId);

    java.util.Optional<PostComment> findByIdAndAuthorId(Long id, Long authorId);
}
