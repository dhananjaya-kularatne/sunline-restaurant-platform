package com.sunline.sunline_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String caption;

    @ElementCollection
    @CollectionTable(name = "food_post_tags", joinColumns = @JoinColumn(name = "food_post_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> taggedItems = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean removed = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
