package com.sunline.sunline_backend.dto.response;

import com.sunline.sunline_backend.dto.MenuItemDTO;

import java.util.List;

public class RecommendationResponse {

    private boolean personalized;
    private List<MenuItemDTO> items;

    public RecommendationResponse() {
    }

    public RecommendationResponse(boolean personalized, List<MenuItemDTO> items) {
        this.personalized = personalized;
        this.items = items;
    }

    public boolean isPersonalized() {
        return personalized;
    }

    public void setPersonalized(boolean personalized) {
        this.personalized = personalized;
    }

    public List<MenuItemDTO> getItems() {
        return items;
    }

    public void setItems(List<MenuItemDTO> items) {
        this.items = items;
    }
}
