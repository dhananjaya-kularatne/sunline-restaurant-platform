package com.sunline.sunline_backend.controller;

import com.sunline.sunline_backend.dto.MenuItemDTO;
import com.sunline.sunline_backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public List<MenuItemDTO> getAllMenu() {
        return menuItemService.getAllAvailableMenuItems();
    }
}
