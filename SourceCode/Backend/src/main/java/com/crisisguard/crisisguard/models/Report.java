package com.crisisguard.crisisguard.models;

import java.sql.Timestamp;

public record Report(
        int userID,
        int reportID,
        int placeID,
        Timestamp time,
        int disasterTypeID,
        String photoURL,
        String description,
        Severity severity
) {}
