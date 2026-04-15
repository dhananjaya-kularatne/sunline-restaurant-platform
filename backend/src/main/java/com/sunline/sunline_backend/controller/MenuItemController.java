package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.MenuItemDTO;
import com.sunline.sunline_backend.dto.response.RecommendationResponse;
import com.sunline.sunline_backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @Autowired
    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @GetMapping
    public List<MenuItemDTO> getAllAvailableMenu() {
        return menuItemService.getAllMenuItems();
    }

    @GetMapping("/trending")
    public List<MenuItemDTO> getTrendingMenuItems(@RequestParam(defaultValue = "4") int limit) {
        return menuItemService.getTrendingMenuItems(limit);
    }

    @GetMapping("/recommendations")
    public RecommendationResponse getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "4") int limit) {
        if (userDetails == null) {
            return new RecommendationResponse(false, menuItemService.getTrendingMenuItems(limit));
        }
        return menuItemService.getRecommendations(userDetails.getUsername(), limit);
    }

    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public List<MenuItemDTO> getAllMenu() {
        return menuItemService.getAllMenuItems();
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public MenuItemDTO addMenuItem(@RequestBody MenuItemDTO menuItemDTO) {
        return menuItemService.addMenuItem(menuItemDTO);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public MenuItemDTO updateMenuItem(@PathVariable Long id, @RequestBody MenuItemDTO menuItemDTO) {
        return menuItemService.updateMenuItem(id, menuItemDTO);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public void deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
    }
}
