package com.hyunh.group_purchase.inventory.service;

import com.hyunh.group_purchase.inventory.dto.InventoryRequest;
import com.hyunh.group_purchase.inventory.entity.Inventory;
import com.hyunh.group_purchase.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public Inventory createProduct(InventoryRequest request) {
        Inventory newProduct = Inventory.builder()
                .productName(request.getProductName())
                .totalStock(request.getTotalStock())
                .remainStock(request.getTotalStock())
                .build();

        return inventoryRepository.save(newProduct);
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
