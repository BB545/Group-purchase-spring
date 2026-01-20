package com.hyunh.group_purchase.reservation.service;

import com.hyunh.group_purchase.inventory.service.InventoryService;
import com.hyunh.group_purchase.reservation.entity.Reservation;
import com.hyunh.group_purchase.reservation.entity.ReservationStatus;
import com.hyunh.group_purchase.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final InventoryService inventoryService;
    private final ReservationRepository reservationRepository;
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

    public List<Reservation> getMyReservations(String email) {
        return reservationRepository.findByUserEmail(email);
    }

    public List<Reservation> getAllReservations(String status) {
        if (status == null) {
            return reservationRepository.findAll();
        }
        ReservationStatus st = ReservationStatus.valueOf(status.toUpperCase());
        return reservationRepository.findByStatus(st);
    }
}
