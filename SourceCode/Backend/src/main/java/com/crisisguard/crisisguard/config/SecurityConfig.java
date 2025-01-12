package com.crisisguard.crisisguard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/report/*/*/*/*").permitAll()
                        .requestMatchers("/report/byUser/*").permitAll()
                        .requestMatchers("/report/bySeverity/*").permitAll()
                        .requestMatchers("/report/dateRange/*/*").permitAll()
                        .requestMatchers("/disaster/*/*/*").permitAll()
                        .requestMatchers("/place/*").permitAll()
                        .anyRequest().authenticated()  // All others require authentication
                )
                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("/report", true)  // Redirect after login
                );

        return http.build();
    }
}