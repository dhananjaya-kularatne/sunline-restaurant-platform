package com.sunline.sunline_backend.chatbot.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sunline.sunline_backend.chatbot.constant.ChatIntent;
import com.sunline.sunline_backend.chatbot.dto.ChatMessageRequest;
import com.sunline.sunline_backend.chatbot.dto.ChatMessageResponse;
import com.sunline.sunline_backend.chatbot.entity.ChatSession;
import com.sunline.sunline_backend.chatbot.repository.ChatSessionRepository;
import com.sunline.sunline_backend.chatbot.util.GroqClient;
import com.sunline.sunline_backend.chatbot.util.IntentDetector;
import com.sunline.sunline_backend.entity.MenuItem;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Logger log = LoggerFactory.getLogger(ChatbotService.class);
    private static final int MAX_HISTORY = 10;
    private static final String SYSTEM_PROMPT =
        "You are a friendly AI assistant for Sunline Restaurant. " +
        "Help customers find food from our menu, make reservations, view their cart, or answer general questions. " +
        "Keep responses concise, warm, and helpful. If you recommend food, mention it by name. " +
        "If asked about something unrelated to the restaurant, politely redirect the conversation.";

    private final GroqClient groqClient;
    private final IntentDetector intentDetector;
    private final ChatSessionRepository chatSessionRepository;
    private final MenuItemRepository menuItemRepository;
    private final ObjectMapper objectMapper;

    public ChatbotService(GroqClient groqClient,
                          IntentDetector intentDetector,
                          ChatSessionRepository chatSessionRepository,
                          MenuItemRepository menuItemRepository) {
        this.groqClient = groqClient;
        this.intentDetector = intentDetector;
        this.chatSessionRepository = chatSessionRepository;
        this.menuItemRepository = menuItemRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public ChatMessageResponse processMessage(ChatMessageRequest request) {
        String userMessage = request.getMessage().trim();
        String sessionId = resolveSessionId(request.getSessionId());

        log.info("Chatbot message for session [{}]: {}", sessionId, userMessage);

        String intent = intentDetector.detect(userMessage);
        String route  = intentDetector.resolveRoute(intent);

        if (ChatIntent.PREFERENCE_FLOW.equals(intent)) {
            List<String> categories = menuItemRepository.findByIsAvailableTrue().stream()
                .flatMap(item -> item.getCategories().stream())
                .distinct()
                .sorted()
                .toList();
            StringBuilder sb = new StringBuilder("I'd love to help you find something you'll enjoy! 😊 What type of food are you in the mood for? Here are our available categories:\n\n");
            for (String category : categories) {
                sb.append("• ").append(category).append("\n");
            }
            String reply = sb.toString();
            saveHistory(sessionId, userMessage, reply);
            return ChatMessageResponse.builder()
                .reply(reply)
                .intent(ChatIntent.PREFERENCE_FLOW)
                .redirectTo(null)
                .sessionId(sessionId)
                .build();
        }

        if (ChatIntent.CATEGORY_PICK.equals(intent)) {
            List<String> knownCategories = Arrays.asList(
                "kottu", "hoppers", "rice & curry", "rice and curry", "seafood",
                "desserts", "snacks", "vegetarian", "meat", "spicy", "mild", "sweet", "mains"
            );
            String matchedCat = "";
            String lowerMsg = userMessage.toLowerCase().trim();
            for (String cat : knownCategories) {
                if (lowerMsg.equals(cat) || lowerMsg.contains(cat)) {
                    matchedCat = cat;
                    break;
                }
            }
            if ("rice and curry".equals(matchedCat)) matchedCat = "Rice & Curry";
            
            final String finalMatCat = matchedCat;
            List<MenuItem> matchedItems = menuItemRepository.findByIsAvailableTrue().stream()
                .filter(item -> item.getCategories().stream().anyMatch(c -> c.equalsIgnoreCase(finalMatCat)))
                .toList();

            String reply;
            if (matchedItems.isEmpty()) {
                reply = "Sorry, I couldn't find any items in that category right now. Try another category or browse our full menu!";
            } else {
                StringBuilder sb = new StringBuilder();
                sb.append("Here are our ").append(matchedCat).append(" items:\n\n");
                for (MenuItem item : matchedItems) {
                    sb.append("🍽 ").append(item.getName()).append(" — LKR ").append(item.getPrice()).append("\n   ")
                      .append(item.getDescription()).append("\n");
                }
                sb.append("\n\nWould you like to add any of these to your cart? Just let me know! 😊");
                reply = sb.toString();
            }
            saveHistory(sessionId, userMessage, reply);
            return ChatMessageResponse.builder()
                .reply(reply)
                .intent(ChatIntent.CATEGORY_PICK)
                .redirectTo(ChatIntent.ROUTE_MENU)
                .sessionId(sessionId)
                .build();
        }

        if (ChatIntent.CATEGORY_BROWSE.equals(intent)) {
            List<MenuItem> allItems = menuItemRepository.findByIsAvailableTrue();
            Map<String, List<MenuItem>> grouped = allItems.stream()
                .flatMap(item -> item.getCategories().stream().map(c -> Map.entry(c, item)))
                .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.mapping(Map.Entry::getValue, Collectors.toList())));
            
            StringBuilder sb = new StringBuilder("Here's what's on our menu:\n\n");
            grouped.keySet().stream().sorted().forEach(cat -> {
                sb.append("**").append(cat).append("**\n");
                for (MenuItem item : grouped.get(cat)) {
                    sb.append("• ").append(item.getName()).append(" — LKR ").append(item.getPrice()).append("\n");
                }
            });
            sb.append("\nWould you like to know more about any item or category? 😊");
            String reply = sb.toString();
            saveHistory(sessionId, userMessage, reply);
            return ChatMessageResponse.builder()
                .reply(reply)
                .intent(ChatIntent.CATEGORY_BROWSE)
                .redirectTo(route)
                .sessionId(sessionId)
                .build();
        }

        List<Map<String, String>> messages = buildMessages(sessionId, userMessage);
        String reply = groqClient.chat(messages);

        saveHistory(sessionId, userMessage, reply);

        return ChatMessageResponse.builder()
            .reply(reply)
            .intent(intent)
            .redirectTo(route)
            .sessionId(sessionId)
            .build();
    }

    @Transactional
    public void clearSession(String sessionId) {
        chatSessionRepository.deleteBySessionId(sessionId);
    }

    private String resolveSessionId(String provided) {
        return (provided != null && !provided.isBlank()) ? provided : UUID.randomUUID().toString();
    }

    private String buildSystemPrompt() {
        List<MenuItem> items = menuItemRepository.findByIsAvailableTrue();
        StringBuilder sb = new StringBuilder(SYSTEM_PROMPT);
        sb.append("\n\nSTRICT RULE: You must ONLY recommend or mention food items from the list above. Never invent, guess, or suggest any food item that is not in this exact list. If asked about something not on the menu, say it is not currently available.\n");
        sb.append("When listing menu items, always show: item name, price in LKR, and a one-line description. Never show image URLs.\n\n");
        sb.append("AVAILABLE MENU ITEMS:\n");
        for (MenuItem item : items) {
            sb.append("- ").append(item.getName())
              .append(" | Categories: ").append(String.join(", ", item.getCategories()))
              .append(" | Price: LKR ").append(item.getPrice())
              .append(" | Description: ").append(item.getDescription()).append("\n");
        }
        return sb.toString();
    }

    private List<Map<String, String>> buildMessages(String sessionId, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", buildSystemPrompt()));

        // Load history
        chatSessionRepository.findBySessionId(sessionId).ifPresent(session -> {
            try {
                List<Map<String, String>> history = objectMapper.readValue(
                    session.getConversationHistory(),
                    new TypeReference<>() {}
                );
                int start = Math.max(0, history.size() - MAX_HISTORY);
                messages.addAll(history.subList(start, history.size()));
            } catch (Exception e) {
                log.warn("Could not parse conversation history: {}", e.getMessage());
            }
        });

        messages.add(Map.of("role", "user", "content", userMessage));
        return messages;
    }

    private void saveHistory(String sessionId, String userMessage, String reply) {
        try {
            ChatSession session = chatSessionRepository.findBySessionId(sessionId)
                .orElse(new ChatSession(sessionId, "[]"));

            List<Map<String, String>> history = objectMapper.readValue(
                session.getConversationHistory(),
                new TypeReference<>() {}
            );
            history.add(Map.of("role", "user", "content", userMessage));
            history.add(Map.of("role", "assistant", "content", reply));

            // Keep last 20 messages
            if (history.size() > 20) history = history.subList(history.size() - 20, history.size());

            session.setConversationHistory(objectMapper.writeValueAsString(history));
            chatSessionRepository.save(session);
        } catch (Exception e) {
            log.error("Failed to save chat history: {}", e.getMessage());
        }
    }
}
