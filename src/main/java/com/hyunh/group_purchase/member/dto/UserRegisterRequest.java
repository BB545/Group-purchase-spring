package com.hyunh.group_purchase.member.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    private String email;
    private String password;
    private String nickname;
}
