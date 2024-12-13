package com.crisisguard.crisisguard.models;

import java.sql.Date;

public record Report(
        Severity report_severity,
        String desc_report,
        String photo,
        int usr_id,
        Date time_start,
        String coords,
        String type_dis_id
) {}
