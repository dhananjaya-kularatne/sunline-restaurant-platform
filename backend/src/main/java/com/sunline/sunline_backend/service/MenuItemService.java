package com.sunline.sunline_backend.service;

import com.sunline.sunline_backend.dto.MenuItemDTO;
import com.sunline.sunline_backend.dto.response.RecommendationResponse;
import com.sunline.sunline_backend.entity.MenuItem;
import com.sunline.sunline_backend.entity.User;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import com.sunline.sunline_backend.repository.OrderRepository;
import com.sunline.sunline_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public MenuItemService(MenuItemRepository menuItemRepository,
                           UserRepository userRepository,
                           OrderRepository orderRepository) {
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<MenuItemDTO> getAllAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MenuItemDTO getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
        return convertToDTO(item);
    }

    public List<MenuItemDTO> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MenuItemDTO addMenuItem(MenuItemDTO dto) {
        MenuItem item = convertToEntity(dto);
        MenuItem savedItem = menuItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public MenuItemDTO updateMenuItem(Long id, MenuItemDTO dto) {
        MenuItem existingItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));

        existingItem.setName(dto.getName());
        existingItem.setDescription(dto.getDescription());
        existingItem.setPrice(dto.getPrice());
        existingItem.setCategories(new HashSet<>(dto.getCategories()));
        existingItem.setImageUrl(dto.getImageUrl());
        existingItem.setIsAvailable(dto.getIsAvailable());

        MenuItem updatedItem = menuItemRepository.save(existingItem);
        return convertToDTO(updatedItem);
    }

    public List<MenuItemDTO> getTrendingMenuItems(int limit) {
        return menuItemRepository.findTrendingMenuItems(PageRequest.of(0, limit))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecommendationResponse getRecommendations(String email, int limit) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long orderCount = orderRepository.countByUser(user);

        if (orderCount < 3) {
            return new RecommendationResponse(false, getTrendingMenuItems(limit));
        }

        List<MenuItemDTO> personalized = menuItemRepository
                .findPersonalizedMenuItems(user, PageRequest.of(0, limit))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        if (personalized.isEmpty()) {
            return new RecommendationResponse(false, getTrendingMenuItems(limit));
        }

        return new RecommendationResponse(true, personalized);
    }

    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new RuntimeException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    private MenuItemDTO convertToDTO(MenuItem item) {
        return MenuItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .categories(new ArrayList<>(item.getCategories()))
                .imageUrl(item.getImageUrl())
                .isAvailable(item.getIsAvailable())
                .build();
    }

    private MenuItem convertToEntity(MenuItemDTO dto) {
        return MenuItem.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .categories(new HashSet<>(dto.getCategories()))
                .imageUrl(dto.getImageUrl())
                .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                .build();
    }
}
