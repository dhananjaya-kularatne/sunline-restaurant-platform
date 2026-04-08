package com.sunline.sunline_backend.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatMessageRequest {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 500, message = "Message must be under 500 characters")
    private String message;

    private String sessionId; // optional
    private String userEmail; // optional — populated by frontend when user is logged in

    public ChatMessageRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
