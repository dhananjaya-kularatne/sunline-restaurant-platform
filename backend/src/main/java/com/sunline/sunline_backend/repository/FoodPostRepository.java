package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.FoodPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodPostRepository extends JpaRepository<FoodPost, Long> {

    @Query("SELECT DISTINCT p FROM FoodPost p JOIN FETCH p.author LEFT JOIN FETCH p.taggedItems WHERE p.removed = false ORDER BY p.createdAt DESC")
    List<FoodPost> findAllActivePosts();
}
