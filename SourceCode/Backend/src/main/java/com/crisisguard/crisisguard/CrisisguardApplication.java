package com.crisisguard.crisisguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class CrisisguardApplication {
	public static void main(String[] args) {
		SpringApplication.run(CrisisguardApplication.class, args);
	}
}
