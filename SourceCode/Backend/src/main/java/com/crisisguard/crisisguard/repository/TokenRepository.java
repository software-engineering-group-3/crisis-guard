package com.crisisguard.crisisguard.repository;

import com.crisisguard.crisisguard.models.Token;
import com.crisisguard.crisisguard.service.FCMService;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class TokenRepository {
    private final JdbcClient jdbcClient;
    private final FCMService fcmService;

    public TokenRepository(JdbcClient jdbcClient, FCMService fcmService) {
        this.jdbcClient = jdbcClient;
        this.fcmService = fcmService;
    }

    /** Save a new token in the database **/
    public void saveToken(Token token) {
        jdbcClient.sql("INSERT INTO fcm_tokens (email, token) VALUES (?, ?)")
                .param(token.email())
                .param(token.token())
                .update();
    }

    /** Get all tokens from the database **/
    public List<Token> getAllTokens() {
        var results = jdbcClient.sql("SELECT * FROM fcm_tokens")
                .query().listOfRows();
        return results.stream().map(this::getTokenModelFromDB).collect(Collectors.toList());
    }

    public Token getTokenModelFromDB(Map<String, Object> dbRepresentation) {
        return new Token(
                (String) dbRepresentation.get("email"),
                (String) dbRepresentation.get("token")
        );
    }

    /** Send push notification to all stored tokens **/
    public void sendPushNotificationToAll(String title, String body) {
        List<Token> tokens = getAllTokens();
        for (Token token : tokens) {
            System.out.println(token.token());
        }
        for (Token token : tokens) {
            fcmService.sendPushNotification(token.token(), title, body);
        }
    }

    /** Delete a token from the database **/
    public void deleteTokenByEmail(String email) {
        jdbcClient.sql("DELETE FROM fcm_tokens WHERE email = ?")
                .param(email)
                .update();
    }
}