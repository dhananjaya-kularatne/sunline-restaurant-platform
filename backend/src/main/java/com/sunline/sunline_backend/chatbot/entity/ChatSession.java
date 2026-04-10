package com.sunline.sunline_backend.chatbot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_sessions")
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sessionId;

    @Column(columnDefinition = "TEXT")
    private String conversationHistory; // JSON string

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    public ChatSession() {}

    public ChatSession(String sessionId, String conversationHistory) {
        this.sessionId = sessionId;
        this.conversationHistory = conversationHistory;
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getConversationHistory() { return conversationHistory; }
    public void setConversationHistory(String h) { this.conversationHistory = h; this.lastUpdated = LocalDateTime.now(); }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
}
