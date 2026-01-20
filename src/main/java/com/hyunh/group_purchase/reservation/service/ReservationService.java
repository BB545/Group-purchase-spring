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

    public boolean reservationProduct(Long productId, int quantity, String userEmail) {
        boolean canReserve = inventoryService.checkAndReserve(productId, quantity);

        if(!canReserve) {
            return false;
        }

        String message = userEmail + ":" + productId + ":" + quantity;
        kafkaTemplate.send("inventory-reservation", message);

        return true;
    }
}
