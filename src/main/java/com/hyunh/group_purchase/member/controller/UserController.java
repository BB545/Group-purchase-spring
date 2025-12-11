package com.hyunh.group_purchase.member.controller;

import com.hyunh.group_purchase.member.dto.LoginRequest;
import com.hyunh.group_purchase.member.dto.UserRegisterRequest;
import com.hyunh.group_purchase.member.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return ResponseEntity.ok(token);

        // message + token 으로 응답 보낼 경우 ResponseEntity<?>로 변경
//        Map<String, String> response = new HashMap<>();
//        response.put("message", "로그인 성공");
//        response.put("token", token);
//
//        return ResponseEntity.ok(response);
    }
}
