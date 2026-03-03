package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsAvailableTrue();

    List<MenuItem> findByCategory(String category);
}
