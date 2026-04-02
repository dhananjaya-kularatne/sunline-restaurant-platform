package com.sunline.sunline_backend.chatbot.controller;

import com.sunline.sunline_backend.chatbot.dto.ChatMessageRequest;
import com.sunline.sunline_backend.chatbot.dto.ChatMessageResponse;
import com.sunline.sunline_backend.chatbot.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    /**
     * POST /api/chatbot/message
     * Scenario 1: Send message → AI response
     * Scenario 2: Empty message → @Valid returns 400 automatically
     */
    @PostMapping("/message")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(chatbotService.processMessage(request));
    }

    /**
     * DELETE /api/chatbot/session/{sessionId}
     * Clear conversation history when customer closes chat
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> clearSession(@PathVariable String sessionId) {
        chatbotService.clearSession(sessionId);
        return ResponseEntity.noContent().build();
    }
}
