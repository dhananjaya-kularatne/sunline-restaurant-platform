package com.sunline.sunline_backend.repository;

import com.sunline.sunline_backend.entity.Order;
import com.sunline.sunline_backend.entity.OrderStatus;
import com.sunline.sunline_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menuItem WHERE o.user = :user ORDER BY o.createdAt DESC")
    List<Order> findByUserWithItems(@Param("user") User user);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menuItem ORDER BY o.createdAt DESC")
    List<Order> findAllWithItems();

    long countByStatus(OrderStatus status);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menuItem WHERE o.createdAt >= :startDate AND o.createdAt < :endDate AND o.status IN :statuses")
    List<Order> findOrdersForReport(
            @Param("startDate") java.time.LocalDateTime startDate,
            @Param("endDate") java.time.LocalDateTime endDate,
            @Param("statuses") List<OrderStatus> statuses);

    long countByUser(User user);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i " +
            "WHERE o.user.email = :email AND i.menuItem.id = :menuItemId " +
            "AND (o.status = 'DELIVERED' OR o.status = 'COMPLETED')")
    boolean hasUserOrderedItemWithStatus(@Param("email") String email, @Param("menuItemId") Long menuItemId);
}
