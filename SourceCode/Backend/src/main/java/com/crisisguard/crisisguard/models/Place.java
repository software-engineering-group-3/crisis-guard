package com.crisisguard.crisisguard.models;

public record Place(
        int placeID,
        int placeTypeID,
        String longitude,
        String latitude,
        String description,
        String cityName,
        String street,
        String houseNumber
) {
    Place(String longitude, String latitude) {
        this(0, 0, longitude, latitude, "", "", "", "");
    }
}