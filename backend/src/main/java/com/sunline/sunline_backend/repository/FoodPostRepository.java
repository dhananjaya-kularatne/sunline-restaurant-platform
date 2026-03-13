package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.FoodPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodPostRepository extends JpaRepository<FoodPost, Long> {
}
