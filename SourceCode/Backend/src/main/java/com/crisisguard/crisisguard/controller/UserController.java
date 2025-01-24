package com.crisisguard.crisisguard.controller;

import java.util.Map;

import com.crisisguard.crisisguard.auth.CheckRole;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserController {
    CheckRole checkRole;

    public UserController(CheckRole checkRole) {
        this.checkRole = checkRole;
    }

    @GetMapping("/user-info")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal){
        return principal.getAttributes();
    }

    @GetMapping("/user-role")
    public String userRole(@AuthenticationPrincipal OAuth2User principal){
        return checkRole.getRole(principal);
    }
}