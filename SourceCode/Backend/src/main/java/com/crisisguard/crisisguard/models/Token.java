package com.crisisguard.crisisguard.models;

import jakarta.persistence.Table;

@Table(name = "fcm_token")
public record Token(String token) {}
