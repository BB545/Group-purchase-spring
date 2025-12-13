package com.hyunh.group_purchase.inventory.controller;

import com.hyunh.group_purchase.inventory.dto.InventoryRequest;
import com.hyunh.group_purchase.inventory.entity.Inventory;
import com.hyunh.group_purchase.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@RequestBody InventoryRequest request) {
        Inventory product = inventoryService.createProduct(request);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return inventoryService.getProduct(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
