package com.crisisguard.crisisguard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/")
    public String loginPage() {
        // Return the login view (e.g., login.html if you're using Thymeleaf)
        return "login";
    }
}
