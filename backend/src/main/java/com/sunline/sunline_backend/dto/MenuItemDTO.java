package com.sunline.sunline_backend.dto;

public class MenuItemDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Boolean isAvailable;

    public MenuItemDTO() {
    }

    public MenuItemDTO(Long id, String name, String description, Double price, String category, String imageUrl,
            Boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
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

    public static class MenuItemDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String category;
        private String imageUrl;
        private Boolean isAvailable;

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

        public MenuItemDTOBuilder category(String category) {
            this.category = category;
            return this;
        }

        public MenuItemDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public MenuItemDTOBuilder isAvailable(Boolean isAvailable) {
            this.isAvailable = isAvailable;
            return this;
        }

        public MenuItemDTO build() {
            return new MenuItemDTO(id, name, description, price, category, imageUrl, isAvailable);
        }
    }
}
