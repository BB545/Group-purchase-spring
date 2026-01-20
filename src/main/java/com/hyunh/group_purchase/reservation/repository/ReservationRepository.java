package com.hyunh.group_purchase.reservation.repository;

import com.hyunh.group_purchase.reservation.entity.Reservation;
import com.hyunh.group_purchase.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserEmail(String useEmail);
    List<Reservation> findByStatus(ReservationStatus status);
}
