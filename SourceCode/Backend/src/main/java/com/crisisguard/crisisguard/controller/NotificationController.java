package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.service.FCMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private FCMService fcmService;

    @PostMapping("/send")
    public String sendNotification(@RequestParam String token,
                                   @RequestParam String title,
                                   @RequestParam String body) {
        fcmService.sendPushNotification(token, title, body);
        return "Notification sent successfully!";
    }
}
