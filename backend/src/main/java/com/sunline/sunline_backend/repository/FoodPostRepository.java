package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.FoodPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodPostRepository extends JpaRepository<FoodPost, Long> {

    @Query("SELECT DISTINCT p FROM FoodPost p LEFT JOIN FETCH p.taggedItems WHERE p.removed = false ORDER BY p.createdAt DESC")
    List<FoodPost> findAllActivePosts();

    @Query("SELECT p FROM FoodPost p LEFT JOIN FETCH p.taggedItems WHERE p.id = :id")
    Optional<FoodPost> findByIdWithTags(@Param("id") Long id);

    @Query("SELECT DISTINCT p FROM FoodPost p LEFT JOIN FETCH p.taggedItems WHERE p.removed = false AND LOWER(p.author.name) LIKE LOWER(CONCAT('%', :username, '%')) ORDER BY p.createdAt DESC")
    List<FoodPost> findActivePostsByUsername(@Param("username") String username);
}
