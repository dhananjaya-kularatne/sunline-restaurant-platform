package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.OrderDto;
import com.sunline.sunline_backend.dto.OrderItemDto;
import com.sunline.sunline_backend.dto.PlaceOrderRequest;
import com.sunline.sunline_backend.entity.Order;
import com.sunline.sunline_backend.entity.OrderItem;
import com.sunline.sunline_backend.entity.OrderStatus;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import com.sunline.sunline_backend.repository.OrderRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
/**
 * Implementation of OrderService for managing restaurant orders.
 * Handles placement, filtering for kitchen/delivery, and status transitions.
 */
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public OrderDto placeOrder(String userEmail, PlaceOrderRequest request) {
        log.info("Placing order for user/guest: {}", userEmail != null ? userEmail : "GUEST");
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Order order = Order.builder()
                .user(user)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .totalPrice(request.getTotalPrice())
                .status(OrderStatus.PENDING)
                .build();

        for (PlaceOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItemRepository.findById(itemReq.getMenuItemId())
                            .orElseThrow(() -> new RuntimeException("Menu item not found")))
                    .quantity(itemReq.getQuantity())
                    .price(itemReq.getPrice())
                    .specialInstructions(itemReq.getSpecialInstructions())
                    .build();
            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Order saved with ID: {}", savedOrder.getId());

        // Send order confirmation email only for guests
        if (user == null) {
            try {
                String mailBody = String.format("Dear %s,\n\nWe have received your order (ID: %d).\n\n" +
                        "Your items will be prepared and delivered to: %s\n\nTotal Amount: LKR %.2f\n\n" +
                        "Thank you for dining with us!\nSunline Restaurant", 
                        savedOrder.getFullName(), savedOrder.getId(), savedOrder.getAddress(), savedOrder.getTotalPrice());
                emailService.sendEmail(savedOrder.getEmail(), "Order Confirmation - Sunline Restaurant", mailBody);
                log.info("Order confirmation email sent to guest: {}", savedOrder.getEmail());
            } catch (Exception e) {
                log.error("Failed to send order confirmation email to guest: {}", savedOrder.getEmail(), e);
            }
        }

        return mapToDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders(String userEmail) {
        log.info("Fetching orders for user: {}", userEmail);
        try {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            List<Order> orders = orderRepository.findByUserWithItems(user);
            log.info("Found {} orders for user {}", orders.size(), userEmail);
            return orders.stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching orders for user: " + userEmail, e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getKitchenOrders() {
        log.info("Fetching kitchen orders for today");
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        return orderRepository.findAllWithItems().stream()
                .filter(order -> order.getCreatedAt().isAfter(startOfDay))
                .filter(order -> order.getStatus() == OrderStatus.PENDING
                        || order.getStatus() == OrderStatus.CONFIRMED
                        || order.getStatus() == OrderStatus.PREPARING
                        || order.getStatus() == OrderStatus.READY)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getDeliveryOrders() {
        log.info("Fetching delivery orders");
        return orderRepository.findAllWithItems().stream()
                .filter(order -> order.getStatus() == OrderStatus.READY
                        || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        log.info("Updating order {} status to {}", orderId, status);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (status == OrderStatus.PREPARING && 
            order.getStatus() != OrderStatus.PENDING && 
            order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException("Only pending or confirmed orders can be moved to preparing");
        }
        if (status == OrderStatus.READY && order.getStatus() != OrderStatus.PREPARING) {
            throw new RuntimeException("Only preparing orders can be marked as ready");
        }
        if (status == OrderStatus.OUT_FOR_DELIVERY && order.getStatus() != OrderStatus.READY) {
            throw new RuntimeException("Only ready orders can be marked out for delivery");
        }
        if (status == OrderStatus.DELIVERED && order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new RuntimeException("Only out for delivery orders can be marked as delivered");
        }

        log.info("Persisting order {} with status {}", order.getId(), status);
        order.setStatus(status);
        return mapToDto(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderDto cancelOrder(Long orderId, String userEmail) {
        log.info("Cancelling order ID: {} for user: {}", orderId, userEmail);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;

        if (!isAdmin && !order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        if (!isAdmin && order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return mapToDto(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        log.info("Fetching all orders for admin");
        return orderRepository.findAllWithItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public long countAllOrders() {
        return orderRepository.count();
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .fullName(order.getFullName())
                .email(order.getEmail())
                .phone(order.getPhone())
                .address(order.getAddress())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(item -> 
                        OrderItemDto.builder()
                                .id(item.getId())
                                .menuItemId(item.getMenuItem().getId())
                                .menuItemName(item.getMenuItem().getName())
                                .menuItemImage(item.getMenuItem().getImageUrl())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .specialInstructions(item.getSpecialInstructions())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
