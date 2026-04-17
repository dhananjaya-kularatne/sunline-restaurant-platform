package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.request.UserRoleRequest;
import com.sunline.sunline_backend.dto.response.DashboardStatsResponse;
import com.sunline.sunline_backend.dto.response.UserResponse;
import com.sunline.sunline_backend.entity.OrderStatus;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.service.UserService;
import com.sunline.sunline_backend.service.FoodPostService;
import com.sunline.sunline_backend.service.OrderService;
import com.sunline.sunline_backend.service.ReservationService;
import com.sunline.sunline_backend.service.SupportReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private FoodPostService foodPostService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private SupportReportService supportReportService;
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalUsers(userService.countAllUsers())
                .totalMenuItems(userService.countAllMenuItems())
                .totalOrders(orderService.countAllOrders())
                .pendingOrders(orderService.countOrdersByStatus(OrderStatus.PENDING))
                .confirmedOrders(orderService.countOrdersByStatus(OrderStatus.CONFIRMED))
                .preparingOrders(orderService.countOrdersByStatus(OrderStatus.PREPARING))
                .readyOrders(orderService.countOrdersByStatus(OrderStatus.READY))
                .outForDeliveryOrders(orderService.countOrdersByStatus(OrderStatus.OUT_FOR_DELIVERY))
                .deliveredOrders(orderService.countOrdersByStatus(OrderStatus.DELIVERED))
                .completedOrders(orderService.countOrdersByStatus(OrderStatus.COMPLETED))
                .cancelledOrders(orderService.countOrdersByStatus(OrderStatus.CANCELLED))
                .totalReservations(reservationService.countAllReservations())
                .totalPosts(foodPostService.countAllPosts())
                .openSupportReports(supportReportService.countOpenSupportReports())
                .averageRating(4.5) // Placeholder: Replace with real logic once MenuItem rating system is implemented
                .build();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam(required = false) String search) {
        List<User> users = userService.getAllUsers(search);
        List<UserResponse> response = users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id, @RequestBody UserRoleRequest request) {
        User.Role role = User.Role.valueOf(request.getRole().toUpperCase());
        User updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(mapToResponse(updatedUser));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id) {
        User updatedUser = userService.toggleUserStatus(id);
        return ResponseEntity.ok(mapToResponse(updatedUser));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getPosts(@RequestParam(required = false, defaultValue = "") String username) {
        return ResponseEntity.ok(foodPostService.getPostsByUsername(username));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> removePost(@PathVariable Long postId) {
        foodPostService.removePost(postId);
        return ResponseEntity.ok().build();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole().name())
                .active(user.getActive() == null || user.getActive())
                .build();
    }
}
