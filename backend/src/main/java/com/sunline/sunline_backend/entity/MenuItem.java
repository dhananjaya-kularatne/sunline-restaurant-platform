package com.sunline.sunline_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url")
    private String imageUrl;

    private Boolean isAvailable = true;

    public MenuItem() {
    }

    public MenuItem(Long id, String name, String description, Double price, String category, String imageUrl,
            Boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable != null ? isAvailable : true;
    }

    public static MenuItemBuilder builder() {
        return new MenuItemBuilder();
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public static class MenuItemBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String category;
        private String imageUrl;
        private Boolean isAvailable = true;

        public MenuItemBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public MenuItemBuilder name(String name) {
            this.name = name;
            return this;
        }

        public MenuItemBuilder description(String description) {
            this.description = description;
            return this;
        }

        public MenuItemBuilder price(Double price) {
            this.price = price;
            return this;
        }

        public MenuItemBuilder category(String category) {
            this.category = category;
            return this;
        }

        public MenuItemBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public MenuItemBuilder isAvailable(Boolean isAvailable) {
            this.isAvailable = isAvailable;
            return this;
        }

        public MenuItem build() {
            return new MenuItem(id, name, description, price, category, imageUrl, isAvailable);
        }
    }
}
