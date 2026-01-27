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

    private String stockKey(Long productId) {
        return "stock:" + productId;
    }

    public Inventory createProduct(InventoryRequest request) {
        Inventory newProduct = Inventory.builder()
                .productName(request.getProductName())
                .totalStock(request.getTotalStock())
                .remainStock(request.getTotalStock())
                .build();

        Inventory saved = inventoryRepository.save(newProduct);

        redisTemplate.opsForValue().set(stockKey(saved.getId()), String.valueOf(saved.getTotalStock()));

        return saved;
    }

    public boolean checkAndReserve(Long productId, int quantity) {
        String key = stockKey(productId);

        String stockStr = redisTemplate.opsForValue().get(key);

        if (stockStr == null) {
            int dbStock = inventoryRepository.findById(productId)
                    .map(Inventory::getRemainStock)
                    .orElse(0);

            redisTemplate.opsForValue().set(key, String.valueOf(dbStock));
            stockStr = String.valueOf(dbStock);
        }

        int stock = Integer.parseInt((stockStr));

        if (stock < quantity) {
            return false;
        }

        Long newStock = redisTemplate.opsForValue().decrement(key, quantity);

        return newStock != null && newStock >= 0;
    }

    public Inventory updateProduct(Long id, InventoryRequest request) {
        Inventory product = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        product.setProductName(request.getProductName());
        product.setTotalStock(request.getTotalStock());
        product.setRemainStock(request.getTotalStock());

        Inventory saved = inventoryRepository.save(product);

        redisTemplate.opsForValue().set(stockKey(id), String.valueOf(request.getTotalStock()));

        return saved;
    }

    public void decreaseStockInDB(Long productId, int quantity) {
        inventoryRepository.findById(productId).ifPresent(inventory -> {
            int newRemain = inventory.getRemainStock() - quantity;
            inventory.setRemainStock(Math.max(newRemain, 0));
            inventoryRepository.save(inventory);
        });
    }

    public void deleteProduct(Long id) {
        Inventory product = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        inventoryRepository.delete(product);
        redisTemplate.delete(stockKey(id));
    }

    public Optional<Inventory> getProduct(Long id) {
        return inventoryRepository.findById(id);
    }

    public void restoreStock(Long productId, int quantity) {
        String redisKey = "stock:" + productId;

        redisTemplate.opsForValue().increment(redisKey, quantity);

        inventoryRepository.findById(productId).ifPresent(inventory -> {
            inventory.setRemainStock(inventory.getRemainStock() + quantity);
            inventoryRepository.save(inventory);
        });
    }
}
