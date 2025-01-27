package com.crisisguard.crisisguard.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import org.springframework.stereotype.Service;

@Service
public class FCMService {

    public void sendPushNotification(String targetToken, String title, String body) {
        try {
            Message message = Message.builder()
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setToken(targetToken)
                    .build();
            System.out.println(message.toString());
            try {
                System.out.println("About to send the message...");
                String response = FirebaseMessaging.getInstance().send(message);
                System.out.println("Successfully sent message:" + response);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}