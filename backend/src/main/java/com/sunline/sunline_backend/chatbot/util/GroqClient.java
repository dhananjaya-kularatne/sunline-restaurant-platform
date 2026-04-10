package com.sunline.sunline_backend.chatbot.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.core.ParameterizedTypeReference;

import java.util.List;
import java.util.Map;

@Component
public class GroqClient {

    private static final Logger log = LoggerFactory.getLogger(GroqClient.class);
    private static final String GROQ_BASE_URL = "https://api.groq.com";
    private static final String MODEL = "llama-3.1-8b-instant";

    @Value("${groq.api.key}")
    private String apiKey;

    private final WebClient webClient;

    public GroqClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(GROQ_BASE_URL).build();
    }

    public String chat(List<Map<String, String>> originalMessages) {
        List<Map<String, String>> messages = new java.util.ArrayList<>();
        for (int i = 0; i < originalMessages.size(); i++) {
            Map<String, String> msg = new java.util.HashMap<>(originalMessages.get(i));
            if (i == 0 && "user".equals(msg.get("role")) && msg.get("content") != null && msg.get("content").contains("STRICT RULE:")) {
                msg.put("role", "system");
            }
            messages.add(msg);
        }

        Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", messages,
                "temperature", 0.7,
                "max_tokens", 512);
        try {
            Map<String, Object> response = webClient.post()
                    .uri("/openai/v1/chat/completions")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
            return extractText(response);
        } catch (WebClientResponseException e) {
            log.error("Groq API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "I'm having trouble connecting right now. Please try again in a moment!";
        } catch (Exception e) {
            log.error("Unexpected Groq error: {}", e.getMessage());
            return "Sorry, I encountered an error. Please try again!";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty())
                return "I couldn't generate a response. Please try rephrasing!";
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            log.error("Failed to parse Groq response: {}", e.getMessage());
            return "I received an unexpected response. Please try again!";
        }
    }
}
