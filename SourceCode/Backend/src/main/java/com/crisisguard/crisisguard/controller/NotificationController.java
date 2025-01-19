package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.repository.TokenRepository;
import com.crisisguard.crisisguard.service.FCMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private FCMService fcmService;

    @Autowired
    private TokenRepository tokenRepository;

    /** Send a push notification to all stored tokens **/
    @PostMapping("/send")
    public String sendNotification(@RequestParam String title,
                                   @RequestParam String body) {
        // Send push notification to all stored tokens
        tokenRepository.sendPushNotificationToAll(title, body);
        return "Notification sent successfully to all tokens!";
    }

    /** Save a new token for push notifications **/
    @PostMapping("/subscribe")
    public String subscribe(@RequestParam String token) {
        // Save the token in the database
        tokenRepository.saveToken(token);
        return "Token saved successfully!";
    }

    /** Remove a token from push notifications **/
    @PostMapping("/unsubscribe")
    public String unsubscribe(@RequestParam String token) {
        // Remove the token from the database
        tokenRepository.deleteToken(token);
        return "Token removed successfully!";
    }
}