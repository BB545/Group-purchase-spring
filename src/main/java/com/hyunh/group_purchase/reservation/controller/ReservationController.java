package com.hyunh.group_purchase.reservation.controller;

import com.hyunh.group_purchase.common.util.JwtUtil;
import com.hyunh.group_purchase.reservation.dto.ReservationRequest;
import com.hyunh.group_purchase.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final JwtUtil jwtUtil;

    @PostMapping("/{productId}")
    public ResponseEntity<?> reserve(@PathVariable Long productId,
                                     @RequestBody ReservationRequest request,
                                     @RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String userEmail = jwtUtil.getEmailFromToken(jwt);

        boolean success = reservationService.reservationProduct(
                productId,
                request.getQuantity(),
                userEmail
        );

        if (!success) {
            return ResponseEntity.badRequest().body("재고가 부족합니다.");
        }

        return ResponseEntity.ok("예약 요청 완료! 결제 대기 상태입니다.");
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.getEmailFromToken(jwt);

        return ResponseEntity.ok(reservationService.getMyReservations(email));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllReservations(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(reservationService.getAllReservations(status));
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<?> cancelReservations(
            @PathVariable Long reservationId,
            @RequestHeader("Authorization") String token
    ) {
        String jwt = token.substring(7);
        String userEmail = jwtUtil.getEmailFromToken(jwt);

        boolean success = reservationService.cancelReservations(reservationId, userEmail);

        if (!success) {
            return ResponseEntity.badRequest().body("예약 취소 실패: 권한이 없거나 이미 취소된 예약입니다.");
        }

        return ResponseEntity.ok("예약이 취소되었습니다.");
    }
}
