package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.auth.CheckRole;
import com.crisisguard.crisisguard.models.Token;
import com.crisisguard.crisisguard.repository.TokenRepository;
import com.crisisguard.crisisguard.service.FCMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private FCMService fcmService;
    private TokenRepository tokenRepository;
    private CheckRole checkRole;

    public NotificationController(FCMService fcmService, TokenRepository tokenRepository, CheckRole checkRole) {
        this.fcmService = fcmService;
        this.tokenRepository = tokenRepository;
        this.checkRole = checkRole;
    }

    /** Send a push notification to all stored tokens **/
    @PostMapping("/send")
    public String sendNotification(@RequestParam String title,
                                   @RequestParam String body,
                                   @AuthenticationPrincipal OAuth2User user) {
        // Check if the user is authorized to send notifications
        if (!checkRole.isAuthority(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        // Send push notification to all stored tokens
        tokenRepository.sendPushNotificationToAll(title, body);
        return "Notification sent successfully to all tokens!";
    }

    /** Save a new token for push notifications **/
    @PostMapping("/subscribe")
    public String subscribe(@RequestParam String token, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isUser(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        // Save the token in the database
        tokenRepository.saveToken(new Token(user.getAttribute("email"), token));
        return "Token saved successfully!";
    }

    /** Remove a token from push notifications **/
    @PostMapping("/unsubscribe")
    public String unsubscribe(@RequestParam String token, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isUser(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        // Remove the token from the database
        tokenRepository.deleteTokenByEmail(user.getAttribute("email"));
        return "Token removed successfully!";
    }
}