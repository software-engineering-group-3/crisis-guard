package com.crisisguard.crisisguard;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import java.io.FileOutputStream;
import java.io.IOException;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class CrisisguardApplication implements CommandLineRunner{
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
	@Override
	 public void run(String... args) throws Exception {
	        String credentialsJson = System.getenv("GOOGLE_CREDENTIALS_JSON");

	        if (credentialsJson != null && !credentialsJson.isEmpty()) {
	            // Write the credentials to a temporary file on Heroku's filesystem
	            try (FileOutputStream fos = new FileOutputStream("/tmp/service-account-key.json")) {
	                fos.write(credentialsJson.getBytes());
	            } catch (IOException e) {
	                e.printStackTrace();
	            }

	            // Set GOOGLE_APPLICATION_CREDENTIALS to the file path
	            System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "/tmp/service-account-key.json");
	        } else {
	            System.err.println("Google credentials JSON not found in environment variables.");
	        }
	    }
}