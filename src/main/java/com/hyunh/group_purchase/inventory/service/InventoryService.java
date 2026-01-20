package com.hyunh.group_purchase.inventory.service;

import com.hyunh.group_purchase.inventory.dto.InventoryRequest;
import com.hyunh.group_purchase.inventory.entity.Inventory;
import com.hyunh.group_purchase.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final StringRedisTemplate redisTemplate;

    public Inventory createProduct(InventoryRequest request) {
        Inventory newProduct = Inventory.builder()
                .productName(request.getProductName())
                .totalStock(request.getTotalStock())
                .remainStock(request.getTotalStock())
                .build();

        Inventory saved = inventoryRepository.save(newProduct);

        String redisKey = "stock:" + saved.getId();
        redisTemplate.opsForValue().set(redisKey, String.valueOf(saved.getTotalStock()));

        return saved;
    }

    public boolean decreaseStock(Long productId) {
        String key = "stock:" + productId;

        Long remain = redisTemplate.opsForValue().decrement(key);

        if (remain != null && remain >= 0) {
            return true;
        }

        // 재고 부족 -> 롤백
        redisTemplate.opsForValue().increment(key);
        return false;
    }

    public Inventory updateProduct(Long id, InventoryRequest request) {
        Inventory product = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        product.setProductName(request.getProductName());
        product.setTotalStock(request.getTotalStock());
        product.setRemainStock(request.getTotalStock());

        return inventoryRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Inventory product = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        inventoryRepository.delete(product);
    }

    public Optional<Inventory> getProduct(Long id) {
        return inventoryRepository.findById(id);
    }
}
