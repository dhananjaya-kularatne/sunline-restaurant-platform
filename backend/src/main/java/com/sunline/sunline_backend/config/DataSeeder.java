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

            // Update existing items that might have null isAvailable status
            repository.findAll().forEach(item -> {
                if (item.getIsAvailable() == null) {
                    item.setIsAvailable(true);
                    repository.save(item);
                }
            });

            if (count == 0) {
                System.out.println("Seeding menu items...");
                repository.saveAll(Arrays.asList(
                        MenuItem.builder()
                                .name("Chicken Kottu")
                                .description(
                                        "Finely chopped flatbread (roti) mixed with spicy chicken, eggs, and vegetables.")
                                .price(850.0)
                                .category("Mains")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("Egg Hoppers (2pcs)")
                                .description(
                                        "Bowl-shaped pancakes made from fermented rice batter and coconut milk, with a whole egg in the center.")
                                .price(350.0)
                                .category("Breakfast/Dinner")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("Rice and Curry (Chicken)")
                                .description(
                                        "Basmati rice served with spicy chicken curry, dhal curry, and two vegetable sides.")
                                .price(750.0)
                                .category("Mains")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("String Hoppers (15pcs)")
                                .description(
                                        "Steamed rice flour noodles pressed into small mats, served with coconut sambal and dhal.")
                                .price(450.0)
                                .category("Breakfast/Dinner")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1567129937968-cdad8f0d5a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("Watalappan")
                                .description(
                                        "Traditional coconut custard pudding with jaggery, eggs, and spices like cardamom and nutmeg.")
                                .price(400.0)
                                .category("Desserts")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("Pol Roti with Lunu Miris")
                                .description("Coconut flatbread served with a spicy onion and chili paste.")
                                .price(300.0)
                                .category("Snacks")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("Beef Curry")
                                .description("Tender beef cubes slow-cooked in a rich and spicy Sri Lankan gravy.")
                                .price(950.0)
                                .category("Mains")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1542367787-4baf35f3037d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build(),
                        MenuItem.builder()
                                .name("Parippu (Dhal Curry)")
                                .description(
                                        "Creamy red lentil curry cooked with coconut milk and tempered with spices.")
                                .price(400.0)
                                .category("Sides")
                                .imageUrl(
                                        "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80")
                                .isAvailable(true)
                                .build()));
            }
        };
    }
}
