package com.sunline.sunline_backend.chatbot.util;

import com.sunline.sunline_backend.chatbot.constant.ChatIntent;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class IntentDetector {

    public String detect(String message) {
        String lowerMsg = message.toLowerCase().trim();
        String[] words = lowerMsg.split("\\s+");

        // 1. CATEGORY_PICK — only if ≤2 words directly naming a category
        List<String> knownCategories = Arrays.asList(
            "kottu", "hoppers", "rice & curry", "rice and curry", "seafood",
            "desserts", "dessert", "snacks", "snack",
            "vegetarian", "meat", "spicy", "mild", "sweet", "mains"
        );
        if (words.length <= 2) {
            for (String cat : knownCategories) {
                if (lowerMsg.equals(cat) || lowerMsg.contains(cat)) {
                    return ChatIntent.CATEGORY_PICK;
                }
            }
        }

        // 2. PREFERENCE_FLOW — checked before MENU_SEARCH to avoid "suggest" conflict
        List<String> preferenceKeywords = Arrays.asList(
            "help me choose", "help me decide", "what should i eat",
            "what do you recommend", "suggest something", "i'm not sure what to eat",
            "i am not sure what to eat", "what's good", "whats good",
            "surprise me", "not sure what to order", "can you suggest",
            "what would you recommend", "help me pick", "what do you suggest"
        );
        for (String kw : preferenceKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.PREFERENCE_FLOW;
        }

        // 3. CATEGORY_BROWSE
        List<String> categoryBrowseKeywords = Arrays.asList(
            "what's on the menu", "whats on the menu", "show me the menu",
            "full menu", "see the menu", "browse", "what do you have",
            "what do you serve", "what can i eat", "menu", "available"
        );
        for (String kw : categoryBrowseKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.CATEGORY_BROWSE;
        }

        // 4. ADD_TO_CART
        List<String> addToCartKeywords = Arrays.asList(
            "add", "order", "buy", "get me", "i'll have", "put in cart"
        );
        for (String kw : addToCartKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.ADD_TO_CART;
        }

        // 5. TRACK_ORDER / RESERVATION
        List<String> trackOrderKeywords = Arrays.asList(
            "track", "where is my order", "order status", "delivery status",
            "how long", "my order", "i want to make a reservation",
            "reservation", "book a table"
        );
        for (String kw : trackOrderKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.TRACK_ORDER;
        }

        // 6. VIEW_CART
        List<String> viewCartKeywords = Arrays.asList(
            "my cart", "view cart", "what's in my cart", "show cart"
        );
        for (String kw : viewCartKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.VIEW_CART;
        }

        // 7. CHECKOUT
        List<String> checkoutKeywords = Arrays.asList(
            "checkout", "payment", "place order", "confirm order"
        );
        for (String kw : checkoutKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.CHECKOUT;
        }

        // 8. RESTAURANT_INFO
        List<String> restaurantInfoKeywords = Arrays.asList(
            "hours", "open", "location", "address", "contact", "phone", "about"
        );
        for (String kw : restaurantInfoKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.RESTAURANT_INFO;
        }

        // 9. MENU_SEARCH — checked last
        List<String> menuSearchKeywords = Arrays.asList(
            "recommend", "suggest", "like", "love", "favourite",
            "vegan", "gluten", "healthy", "halal", "i want something"
        );
        for (String kw : menuSearchKeywords) {
            if (lowerMsg.contains(kw)) return ChatIntent.MENU_SEARCH;
        }

        return ChatIntent.GENERAL;
    }

    public String resolveRoute(String intent) {
        return switch (intent) {
            case ChatIntent.ADD_TO_CART, ChatIntent.VIEW_CART -> ChatIntent.ROUTE_CART;
            case ChatIntent.TRACK_ORDER                       -> ChatIntent.ROUTE_ORDERS;
            case ChatIntent.CATEGORY_BROWSE,
                 ChatIntent.MENU_SEARCH,
                 ChatIntent.CATEGORY_PICK,
                 ChatIntent.PREFERENCE_FLOW                   -> ChatIntent.ROUTE_MENU;
            default                                           -> null;
        };
    }
}
