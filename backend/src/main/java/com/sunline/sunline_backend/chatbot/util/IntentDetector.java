package com.sunline.sunline_backend.chatbot.util;

import com.sunline.sunline_backend.chatbot.constant.ChatIntent;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class IntentDetector {

    private static final Map<String, List<String>> INTENT_KEYWORDS;
    static {
        INTENT_KEYWORDS = new LinkedHashMap<>();
        INTENT_KEYWORDS.put(ChatIntent.ADD_TO_CART, Arrays.asList(
            "add", "order", "buy", "get me", "i want", "i'll have", "put in cart",
            "yes", "yes please", "add it", "add that", "add this", "yeah add", "sure add",
            "add [", "please add", "can you add", "put it in my cart", "add to my cart",
            "i'll take", "i'd like", "yes i want"
        ));
        INTENT_KEYWORDS.put(ChatIntent.VIEW_CART,       Arrays.asList("my cart", "view cart", "what's in my cart", "show cart"));
        INTENT_KEYWORDS.put(ChatIntent.CHECKOUT,        Arrays.asList("checkout", "pay", "payment", "place order", "confirm order"));
        INTENT_KEYWORDS.put(ChatIntent.TRACK_ORDER,     Arrays.asList("track", "where is my order", "order status", "my order", "reservation", "i want to make a reservation"));
        INTENT_KEYWORDS.put(ChatIntent.CATEGORY_BROWSE, Arrays.asList("show me", "list", "browse", "what", "available", "menu", "category", "what's on the menu"));
        INTENT_KEYWORDS.put(ChatIntent.RESTAURANT_INFO, Arrays.asList("hours", "open", "location", "address", "contact", "phone", "about"));
        INTENT_KEYWORDS.put(ChatIntent.MENU_SEARCH,     Arrays.asList("recommend", "suggest", "like", "love", "favourite", "spicy", "vegetarian", "vegan", "gluten"));
    }

    public String detect(String message) {
        String lowerMsg = message.toLowerCase().trim();
        for (Map.Entry<String, List<String>> entry : INTENT_KEYWORDS.entrySet()) {
            for (String kw : entry.getValue()) {
                if (lowerMsg.contains(kw)) {
                    return entry.getKey();
                }
            }
        }
        return ChatIntent.GENERAL;
    }

    public String resolveRoute(String intent) {
        return switch (intent) {
            case ChatIntent.ADD_TO_CART, ChatIntent.VIEW_CART -> ChatIntent.ROUTE_CART;
            case ChatIntent.TRACK_ORDER -> ChatIntent.ROUTE_ORDERS;
            case ChatIntent.CATEGORY_BROWSE,
                 ChatIntent.MENU_SEARCH,
                 ChatIntent.CATEGORY_PICK,
                 ChatIntent.PREFERENCE_FLOW -> ChatIntent.ROUTE_MENU;
            default -> null;
        };
    }
}
