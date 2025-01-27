package com.crisisguard.crisisguard.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.io.*;

@Configuration
public class FirebaseConfig {
    public FirebaseConfig() throws IOException {
        JsonObject jsonObject = JsonParser.parseString(System.getenv("GOOGLE_CREDENTIALS_JSON")).getAsJsonObject();
        InputStream is = new ByteArrayInputStream(jsonObject.toString().getBytes());
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream((is)))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}