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

    public Optional<Inventory> getProduct(Long id) {
        return inventoryRepository.findById(id);
    }
}
