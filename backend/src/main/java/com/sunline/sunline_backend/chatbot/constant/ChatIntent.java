package com.sunline.sunline_backend.chatbot.constant;

public final class ChatIntent {

    private ChatIntent() {}

    public static final String MENU_SEARCH     = "MENU_SEARCH";
    public static final String CATEGORY_BROWSE = "CATEGORY_BROWSE";
    public static final String ADD_TO_CART     = "ADD_TO_CART";
    public static final String TRACK_ORDER     = "TRACK_ORDER";
    public static final String ORDER_STATUS    = "ORDER_STATUS";
    public static final String VIEW_CART       = "VIEW_CART";
    public static final String CHECKOUT        = "CHECKOUT";
    public static final String RESTAURANT_INFO = "RESTAURANT_INFO";
    public static final String GENERAL         = "GENERAL";
    public static final String PREFERENCE_FLOW = "PREFERENCE_FLOW";
    public static final String CATEGORY_PICK   = "CATEGORY_PICK";

    public static final String ROUTE_MENU     = "/menu";
    public static final String ROUTE_CART     = "/cart";
    public static final String ROUTE_ORDERS   = "/reservations";
    public static final String ROUTE_HOME     = "/";
}
