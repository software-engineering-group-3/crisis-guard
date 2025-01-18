package com.crisisguard.crisisguard.repository;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    private final JdbcClient jdbcClient;

    UserRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /* Read */

    public String getUserRole(String name) {
//        TODO: add SQL query to get user role from database
//        try {
//            var result = jdbcClient.sql("SELECT role FROM user WHERE username = ?")
//                    .param(name)
//                    .query().singleRow();
//
//            return result.get("role").toString();
//        }
//        catch (Exception e) {
//            return null;
//        }

        return "ROLE_AUTHORITY";
    }
}