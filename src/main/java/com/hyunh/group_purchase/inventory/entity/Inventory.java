package com.hyunh.group_purchase.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private int totalStock;

    @Column(nullable = false)
    private int remainStock;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 재고 차감 - Kafka Consumer
    public void decreaseStock() {
        if (remainStock > 0) {
            remainStock--;
        } else {
            throw new IllegalStateException("재고가 부족합니다.");
        }
    }

    // 상품 수정 시 시간 업데이트
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
