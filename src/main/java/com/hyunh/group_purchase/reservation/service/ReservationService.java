package com.hyunh.group_purchase.reservation.service;

import com.hyunh.group_purchase.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final InventoryService inventoryService;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public boolean reservationProduct(Long productId, String userEmail) {
        boolean success = inventoryService.decreaseStock(productId);

        if(!success) {
            return false;
        }

        String message = userEmail + ":" + productId;
        kafkaTemplate.send("inventory-reservation", message);

        return true;
    }
}
