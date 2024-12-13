package com.crisisguard.crisisguard.models;

public record Place(
        String coords,
        int house_num,
        int type_place_id,
        int post_num,
        String name_street
) { }