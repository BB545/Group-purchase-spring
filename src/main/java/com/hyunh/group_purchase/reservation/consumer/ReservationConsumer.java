package com.hyunh.group_purchase.reservation.consumer;

import com.hyunh.group_purchase.inventory.repository.InventoryRepository;
import com.hyunh.group_purchase.reservation.entity.Reservation;
import com.hyunh.group_purchase.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationConsumer {
    private final ReservationRepository reservationRepository;
    private final InventoryRepository inventoryRepository;

    @KafkaListener(topics = "inventory-reservation", groupId = "reservation-group")
    public void consume(String message) {
        System.out.println("Kafka 메세지 수신: " + message);

        String[] split = message.split(":");
        String email = split[0];
        Long productId = Long.parseLong(split[1]);

        Reservation reservation = Reservation.builder()
                .userEmail(email)
                .productId(productId)
                .status("Waiting")
                .build();

        reservationRepository.save(reservation);

        inventoryRepository.findById(productId).ifPresent(inventory -> {
            inventory.setRemainStock(inventory.getRemainStock() - 1);
            inventoryRepository.save(inventory);
        });

        System.out.println("예약 저장 완료 + remainStock 감소 완료");
    }
}
