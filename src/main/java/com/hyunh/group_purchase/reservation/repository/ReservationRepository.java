package com.hyunh.group_purchase.reservation.repository;

import com.hyunh.group_purchase.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
