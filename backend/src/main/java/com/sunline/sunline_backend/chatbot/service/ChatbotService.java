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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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
    private final ObjectMapper objectMapper;

    public ChatbotService(GroqClient groqClient,
                          IntentDetector intentDetector,
                          ChatSessionRepository chatSessionRepository) {
        this.groqClient = groqClient;
        this.intentDetector = intentDetector;
        this.chatSessionRepository = chatSessionRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public ChatMessageResponse processMessage(ChatMessageRequest request) {
        String userMessage = request.getMessage().trim();
        String sessionId = resolveSessionId(request.getSessionId());

        log.info("Chatbot message for session [{}]: {}", sessionId, userMessage);

        String intent = intentDetector.detect(userMessage);
        String route  = intentDetector.resolveRoute(intent);

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

    private List<Map<String, String>> buildMessages(String sessionId, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));

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
