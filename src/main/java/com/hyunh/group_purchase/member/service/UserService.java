package com.hyunh.group_purchase.member.service;

import com.hyunh.group_purchase.common.util.JwtUtil;
import com.hyunh.group_purchase.member.dto.LoginRequest;
import com.hyunh.group_purchase.member.dto.UserRegisterRequest;
import com.hyunh.group_purchase.member.entity.User;
import com.hyunh.group_purchase.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(UserRegisterRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        if(userRepository.findByNickname(request.getNickname()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .nickname(request.getNickname())
                .password(encodedPassword)
                .build();

        // DB 저장
        userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 - 토큰 발급
        return jwtUtil.generateToken(user.getEmail());
    }


}
