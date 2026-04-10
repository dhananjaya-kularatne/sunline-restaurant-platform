package com.sunline.sunline_backend.chatbot.repository;

import com.sunline.sunline_backend.chatbot.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findBySessionId(String sessionId);
    void deleteBySessionId(String sessionId);
}
