package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.Rating;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByMenuItemId(Long menuItemId);
    
    Optional<Rating> findByUserAndMenuItem(User user, MenuItem menuItem);
    
    boolean existsByUserAndMenuItem(User user, MenuItem menuItem);
    
    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.menuItem.id = :menuItemId")
    Double getAverageRating(@Param("menuItemId") Long menuItemId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.menuItem.id = :menuItemId")
    Long countByMenuItemId(@Param("menuItemId") Long menuItemId);
}
