package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.MenuItemDTO;
import com.sunline.sunline_backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
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
