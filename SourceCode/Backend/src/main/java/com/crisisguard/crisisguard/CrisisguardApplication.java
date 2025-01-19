package com.crisisguard.crisisguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class CrisisguardApplication {
	public static void main(String[] args) {
		SpringApplication.run(CrisisguardApplication.class, args);
//		try {
//			System.out.println(getAccessToken());
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//	
//	
	}
	
//	private static String getAccessToken() throws IOException {
//	  GoogleCredentials googleCredentials = GoogleCredentials
//	          .fromStream(new FileInputStream("src/main/resources/crisisguard-86c28-firebase-adminsdk-pp0rb-1cd86c62e2.json"))
//	          .createScoped(Arrays.asList("https://www.googleapis.com/auth/firebase.messaging"));
//	  googleCredentials.refresh();
//	  return googleCredentials.getAccessToken().getTokenValue();
//}
}