package com.sunline.sunline_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "post_reactions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private FoodPost post;

    @Enumerated(EnumType.STRING)
    private ReactionType reactionType;
}
