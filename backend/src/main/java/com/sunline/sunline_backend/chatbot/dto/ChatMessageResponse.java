package com.sunline.sunline_backend.chatbot.dto;

import java.util.List;
import java.util.Map;

public class ChatMessageResponse {

    private String reply;
    private String intent;
    private String redirectTo;
    private String sessionId;
    private List<Map<String, Object>> cartItems;

    public ChatMessageResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ChatMessageResponse r = new ChatMessageResponse();
        public Builder reply(String v)      { r.reply = v; return this; }
        public Builder intent(String v)     { r.intent = v; return this; }
        public Builder redirectTo(String v) { r.redirectTo = v; return this; }
        public Builder sessionId(String v)  { r.sessionId = v; return this; }
        public Builder cartItems(List<Map<String, Object>> v) { r.cartItems = v; return this; }
        public ChatMessageResponse build()  { return r; }
    }

    public String getReply()      { return reply; }
    public String getIntent()     { return intent; }
    public String getRedirectTo() { return redirectTo; }
    public String getSessionId()  { return sessionId; }
    public List<Map<String, Object>> getCartItems() { return cartItems; }
}
