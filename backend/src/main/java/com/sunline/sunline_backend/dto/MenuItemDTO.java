package com.sunline.sunline_backend.dto;

import java.util.ArrayList;
import java.util.List;

public class MenuItemDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private List<String> categories = new ArrayList<>();
    private String imageUrl;

    public MenuItemDTO() {
    }

    public MenuItemDTO(Long id, String name, String description, Double price, List<String> categories,
            String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.categories = categories != null ? categories : new ArrayList<>();
        this.imageUrl = imageUrl;
    }

    public static MenuItemDTOBuilder builder() {
        return new MenuItemDTOBuilder();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public static class MenuItemDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private List<String> categories = new ArrayList<>();
        private String imageUrl;

        public MenuItemDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public MenuItemDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public MenuItemDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public MenuItemDTOBuilder price(Double price) {
            this.price = price;
            return this;
        }

        public MenuItemDTOBuilder categories(List<String> categories) {
            this.categories = categories;
            return this;
        }

        public MenuItemDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public MenuItemDTO build() {
            return new MenuItemDTO(id, name, description, price, categories, imageUrl);
        }
    }
}
