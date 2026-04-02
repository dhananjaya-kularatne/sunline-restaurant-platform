package com.sunline.sunline_backend.chatbot.util;

import com.sunline.sunline_backend.chatbot.constant.ChatIntent;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class IntentDetector {

    private static final Map<String, List<String>> INTENT_KEYWORDS = Map.of(
        ChatIntent.ADD_TO_CART,     Arrays.asList("add", "order", "buy", "get me", "i want", "i'll have", "put in cart"),
        ChatIntent.TRACK_ORDER,     Arrays.asList("track", "where is my order", "order status", "my order", "reservation"),
        ChatIntent.VIEW_CART,       Arrays.asList("my cart", "view cart", "what's in my cart", "show cart"),
        ChatIntent.CHECKOUT,        Arrays.asList("checkout", "pay", "payment", "place order", "confirm order"),
        ChatIntent.CATEGORY_BROWSE, Arrays.asList("show me", "list", "browse", "what", "available", "menu", "category"),
        ChatIntent.RESTAURANT_INFO, Arrays.asList("hours", "open", "location", "address", "contact", "phone", "about"),
        ChatIntent.MENU_SEARCH,     Arrays.asList("recommend", "suggest", "like", "love", "favourite", "spicy", "vegetarian", "vegan", "gluten")
    );

    public String detect(String message) {
        String lower = message.toLowerCase();
        for (Map.Entry<String, List<String>> entry : INTENT_KEYWORDS.entrySet()) {
            for (String kw : entry.getValue()) {
                if (lower.contains(kw)) return entry.getKey();
            }
        }
        return ChatIntent.GENERAL;
    }

    public String resolveRoute(String intent) {
        return switch (intent) {
            case ChatIntent.ADD_TO_CART, ChatIntent.VIEW_CART -> ChatIntent.ROUTE_CART;
            case ChatIntent.TRACK_ORDER                       -> ChatIntent.ROUTE_ORDERS;
            case ChatIntent.CATEGORY_BROWSE, ChatIntent.MENU_SEARCH -> ChatIntent.ROUTE_MENU;
            default -> null;
        };
    }
}
