package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.MenuItem;
import com.sunline.sunline_backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsAvailableTrue();

    List<MenuItem> findByCategoriesContaining(String category);

    @Query("SELECT oi.menuItem FROM OrderItem oi WHERE oi.menuItem.isAvailable = true GROUP BY oi.menuItem ORDER BY SUM(oi.quantity) DESC")
    List<MenuItem> findTrendingMenuItems(Pageable pageable);

    @Query("SELECT oi.menuItem FROM OrderItem oi WHERE oi.order.user = :user AND oi.menuItem.isAvailable = true GROUP BY oi.menuItem ORDER BY SUM(oi.quantity) DESC")
    List<MenuItem> findPersonalizedMenuItems(@Param("user") User user, Pageable pageable);
}
