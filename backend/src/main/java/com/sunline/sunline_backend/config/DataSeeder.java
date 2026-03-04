package com.sunline.sunline_backend.config;

import com.sunline.sunline_backend.entity.MenuItem;
import com.sunline.sunline_backend.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataSeeder {

        @Bean
        CommandLineRunner initDatabase(MenuItemRepository repository) {
                return args -> {
                        long count = repository.count();
                        System.out.println("Current menu item count: " + count);

                        // For Phase 2, we want to ensure multi-category support
                        // If we have old items, let's clear them to seed fresh with multi-categories
                        if (count > 0) {
                                System.out.println("Clearing old menu items for Phase 2...");
                                repository.deleteAll();
                        }

                        System.out.println("Seeding menu items with multi-categories...");
                        repository.saveAll(Arrays.asList(
                                        MenuItem.builder()
                                                        .name("Vegetable Kottu")
                                                        .description("Finely chopped flatbread (roti) mixed with fresh vegetables, eggs, and mild spices. A vegetarian favourite.")
                                                        .price(650.0)
                                                        .category("Kottu")
                                                        .category("Vegetarian")
                                                        .imageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Chicken Kottu")
                                                        .description("Spicy shredded roti stir-fried with chicken, eggs, and leeks. The ultimate Sri Lankan comfort food.")
                                                        .price(850.0)
                                                        .category("Kottu")
                                                        .category("Meat")
                                                        .category("Spicy")
                                                        .imageUrl("https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Egg Hoppers (2pcs)")
                                                        .description("Bowl-shaped pancakes with a whole egg in the center. Best with lunu miris.")
                                                        .price(350.0)
                                                        .category("Hoppers")
                                                        .category("Vegetarian")
                                                        .imageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Fish Ambul Thiyal")
                                                        .description("Traditional sour fish curry cooked with black pepper and gamboge.")
                                                        .price(950.0)
                                                        .category("Rice & Curry")
                                                        .category("Seafood")
                                                        .category("Spicy")
                                                        .imageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Parippu (Dhal Curry)")
                                                        .description("Creamy red lentil curry cooked with coconut milk. Mild and comforting.")
                                                        .price(400.0)
                                                        .category("Rice & Curry")
                                                        .category("Vegetarian")
                                                        .category("Mild")
                                                        .imageUrl("https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Watalappan")
                                                        .description("Spiced coconut custard pudding with jaggery and cashews.")
                                                        .price(450.0)
                                                        .category("Desserts")
                                                        .category("Sweet")
                                                        .imageUrl("https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Pol Roti with Lunu Miris")
                                                        .description("Coconut flatbread served with a fiery onion and chili paste.")
                                                        .price(300.0)
                                                        .category("Snacks")
                                                        .category("Vegetarian")
                                                        .category("Spicy")
                                                        .imageUrl("https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build(),
                                        MenuItem.builder()
                                                        .name("Devilled Prawns")
                                                        .description("Fiery prawns tossed in a tangy tomato and chili sauce.")
                                                        .price(1200.0)
                                                        .category("Seafood")
                                                        .category("Spicy")
                                                        .category("Mains")
                                                        .imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                                        .isAvailable(true)
                                                        .build()));
                };
        }
}
