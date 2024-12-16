package com.crisisguard.crisisguard.models;

import java.sql.Date;

public record Disaster(
        Date time_end,
        Date time_start,
        Severity severity,
        int area_size,
        String coords,
        String type_dis_id
) { }
