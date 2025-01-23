package com.crisisguard.crisisguard;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import io.github.bonigarcia.wdm.WebDriverManager;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.timeout;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

@SpringBootTest
public class CrisisguardApplicationTests {
	private static WebDriver driver;
	private static WebDriver driver_2;
	private WebDriverWait wait;
	private WebDriverWait longwait;

	@BeforeAll
	public void setUp() {
		WebDriverManager.chromedriver().setup();
		driver = new ChromeDriver();
		driver_2 = new ChromeDriver();
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		longwait = new WebDriverWait(driver, Duration.ofSeconds(20));
	}

	@Test
	public void testLogin() {
		driver.get("https://crisis-guard-frontend-d4ce1dc3fa0e.herokuapp.com/");
		timeout(4000);

		// WebElement usernameElement =
		driver.findElement(By.className("oauth-button")).click();
		timeout(10000);
		// usernameElement.sendKeys("fferko");
		driver.findElement(By.linkText("Google")).click();

		timeout(100000);
		// AFTWye vEQsqe
		driver.findElement(By.id("identifierId")).sendKeys("pavlezulj01@gmail.com");
		timeout(20000);
		driver.findElement(By.xpath("//button//span[text()='Next']")).click();
		timeout(10000);

		driver.get("http://127.0.0.1:5500/SourceCode/Frontend/index.html");
		try {
			Thread.sleep(2000); // Pauses for 5 seconds
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		// driver.findElement(By.xpath("//button//span[text()='Try again']")).click();

		return;
	}

	@Test
	public void testSubmitIncidentReport() {
		try {
			// 1. Open the application
			driver.get("http://127.0.0.1:5500/SourceCode/Frontend/index.html");

			// WebElement reportForm =
			// wait.until(ExpectedConditions.presenceOfElementLocated(By.id("report-form")));
			// Assertions.assertTrue(reportForm.isDisplayed(), "Report form should be
			// visible");

			// 3. Select Flood from the disaster type dropdown
			Select incidentType = new Select(driver.findElement(By.id("type")));
			incidentType.selectByValue("flood");
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// 4. Enter location coordinates
			WebElement manualLocationBtn = driver.findElement(By.id("manual-location-button"));
			manualLocationBtn.click();
			try {
				Thread.sleep(1000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle first alert - Confirm manual location entry
			Alert firstAlert = driver.switchTo().alert();
			firstAlert.accept(); // Click OK

			try {
				Thread.sleep(1000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle second alert - Location not found
			// wait.until(ExpectedConditions.alertIsPresent());
			Alert secondAlert = driver.switchTo().alert();
			secondAlert.accept(); // Click OK

			try {
				Thread.sleep(1000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			WebElement map = longwait.until(ExpectedConditions.presenceOfElementLocated(By.id("map")));
			map.click();

			// Handle third alert after map click
			// wait.until(ExpectedConditions.alertIsPresent());
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			Alert thirdAlert = driver.switchTo().alert();
			thirdAlert.accept(); // Click OK

			// WebElement addressInput = driver.findElement(By.id("address"));
			// addressInput.sendKeys("45.8150° N, 15.9819° E");

			// 5. Enter description and upload image
			WebElement description = driver.findElement(By.id("description"));
			description.sendKeys("Severe flooding in the city center");

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// Upload image
			WebElement fileInput = driver.findElement(By.id("photo"));
			Path imagePath = Paths.get("SourceCode\\Backend\\src\\test\\java\\com\\crisisguard\\test_image.png");
			String absolutePath = imagePath.toAbsolutePath().toString();
			fileInput.sendKeys(absolutePath);

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// WebElement currentLocationCheckbox =
			// driver.findElement(By.id("use-current-location"));
			// currentLocationCheckbox.click();

			// 6. Submit the form and wait for the success alert
			// Submit the form with explicit press and release actions
			WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
			submitButton.click();

			// Wait for and handle the success alert
			longwait.until(ExpectedConditions.alertIsPresent());
			Alert successAlert = driver.switchTo().alert();
			successAlert.accept();
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}
			// Alert fourthAlert = driver.switchTo().alert();
			// fourthAlert.accept();

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// 7. Verify confirmation message

		} catch (Exception e) {
			// Take screenshot on failure
			// Utils.takeScreenshot(driver, "test_failure.png");
			throw e;
		}
	}

	@Test
	public void testViewActiveReport() {
		try {
			// 1. Open the application
			driver.get("http://127.0.0.1:5500/SourceCode/Frontend/index.html");

			// WebElement reportForm =
			// wait.until(ExpectedConditions.presenceOfElementLocated(By.id("report-form")));
			// Assertions.assertTrue(reportForm.isDisplayed(), "Report form should be
			// visible");

			// 3. Select Flood from the disaster type dropdown
			Select incidentType = new Select(driver.findElement(By.id("type")));
			incidentType.selectByValue("flood");
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// 4. Enter location coordinates
			WebElement manualLocationBtn = driver.findElement(By.id("manual-location-button"));
			manualLocationBtn.click();
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle first alert - Confirm manual location entry
			Alert firstAlert = driver.switchTo().alert();
			firstAlert.accept(); // Click OK

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle second alert - Location not found
			// wait.until(ExpectedConditions.alertIsPresent());
			Alert secondAlert = driver.switchTo().alert();
			secondAlert.accept(); // Click OK

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			WebElement map = longwait.until(ExpectedConditions.presenceOfElementLocated(By.id("map")));
			map.click();

			// Handle third alert after map click
			// wait.until(ExpectedConditions.alertIsPresent());
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			Alert thirdAlert = driver.switchTo().alert();
			thirdAlert.accept(); // Click OK

			// WebElement addressInput = driver.findElement(By.id("address"));
			// addressInput.sendKeys("45.8150° N, 15.9819° E");
			// 5. Enter description and upload image
			WebElement description = driver.findElement(By.id("description"));
			description.sendKeys("There is an earthquake with the epicenter in the city center!");

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// Upload image
			WebElement fileInput = driver.findElement(By.id("photo"));
			Path imagePath = Paths.get("SourceCode\\Backend\\src\\test\\java\\com\\crisisguard\\test_image.png");
			String absolutePath = imagePath.toAbsolutePath().toString();
			fileInput.sendKeys(absolutePath);

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// WebElement currentLocationCheckbox =
			// driver.findElement(By.id("use-current-location"));
			// currentLocationCheckbox.click();

			// 6. Submit the form and wait for the success alert
			// Submit the form with explicit press and release actions
			WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
			submitButton.click();

			// Wait for and handle the success alert
			longwait.until(ExpectedConditions.alertIsPresent());
			Alert successAlert = driver.switchTo().alert();
			successAlert.accept();
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

		} catch (Exception e) {
			// Take screenshot on failure
			// Utils.takeScreenshot(driver, "test_failure.png");
			throw e;
		}

	}

	@Test
	public void testViewActiveReport_2() {
		try {
			// 1. Open the application
			driver.get("http://127.0.0.1:5500/SourceCode/Frontend/index.html");

			// WebElement reportForm =
			// wait.until(ExpectedConditions.presenceOfElementLocated(By.id("report-form")));
			// Assertions.assertTrue(reportForm.isDisplayed(), "Report form should be
			// visible");

			// 3. Select Flood from the disaster type dropdown
			Select incidentType = new Select(driver.findElement(By.id("type")));
			incidentType.selectByValue("earthquake");
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// 4. Enter location coordinates
			WebElement manualLocationBtn = driver.findElement(By.id("manual-location-button"));
			manualLocationBtn.click();
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle first alert - Confirm manual location entry
			Alert firstAlert = driver.switchTo().alert();
			firstAlert.accept(); // Click OK

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle second alert - Location not found
			// wait.until(ExpectedConditions.alertIsPresent());
			Alert secondAlert = driver.switchTo().alert();
			secondAlert.accept(); // Click OK

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			WebElement map = longwait.until(ExpectedConditions.presenceOfElementLocated(By.id("map")));
			map.click();

			// Handle third alert after map click
			// wait.until(ExpectedConditions.alertIsPresent());
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			Alert thirdAlert = driver.switchTo().alert();
			thirdAlert.accept(); // Click OK

			// WebElement addressInput = driver.findElement(By.id("address"));
			// addressInput.sendKeys("45.8150° N, 15.9819° E");
			// 5. Enter description and upload image
			WebElement description = driver.findElement(By.id("description"));
			description.sendKeys("There is an earthquake with the epicenter in the city center!");

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// Upload image
			WebElement fileInput = driver.findElement(By.id("photo"));
			Path imagePath = Paths.get("SourceCode\\Backend\\src\\test\\java\\com\\crisisguard\\test_image.png");
			String absolutePath = imagePath.toAbsolutePath().toString();
			fileInput.sendKeys(absolutePath);

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// WebElement currentLocationCheckbox =
			// driver.findElement(By.id("use-current-location"));
			// currentLocationCheckbox.click();

			// 6. Submit the form and wait for the success alert
			// Submit the form with explicit press and release actions
			WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
			submitButton.click();

			// Wait for and handle the success alert
			longwait.until(ExpectedConditions.alertIsPresent());
			Alert successAlert = driver.switchTo().alert();
			successAlert.accept();
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// 7. Verify confirmation message===============================================

			driver.get(driver.getCurrentUrl());

			try {
				Thread.sleep(5000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();

			try {
				Thread.sleep(3000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			map = longwait.until(ExpectedConditions.presenceOfElementLocated(By.id("map")));
			map.click();

			try {
				Thread.sleep(10000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			incidentType = new Select(driver.findElement(By.id("type")));
			incidentType.selectByValue("earthquake");
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// 4. Enter location coordinates
			manualLocationBtn = driver.findElement(By.id("manual-location-button"));
			manualLocationBtn.click();
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle first alert - Confirm manual location entry
			firstAlert = driver.switchTo().alert();
			firstAlert.accept(); // Click OK

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			// Handle second alert - Location not found
			// wait.until(ExpectedConditions.alertIsPresent());
			secondAlert = driver.switchTo().alert();
			secondAlert.accept(); // Click OK

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			map = longwait.until(ExpectedConditions.presenceOfElementLocated(By.id("map")));
			map.click();

			// Handle third alert after map click
			// wait.until(ExpectedConditions.alertIsPresent());
			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			thirdAlert = driver.switchTo().alert();
			thirdAlert.accept(); // Click OK

			// WebElement addressInput = driver.findElement(By.id("address"));
			// addressInput.sendKeys("45.8150° N, 15.9819° E");
			// 5. Enter description and upload image
			description = driver.findElement(By.id("description"));
			description.sendKeys("There is an earthquake with the epicenter in the city center!");

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// Upload image
			fileInput = driver.findElement(By.id("photo"));
			imagePath = Paths.get("SourceCode\\Backend\\src\\test\\java\\com\\crisisguard\\test_image.png");
			absolutePath = imagePath.toAbsolutePath().toString();
			fileInput.sendKeys(absolutePath);

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// WebElement currentLocationCheckbox =
			// driver.findElement(By.id("use-current-location"));
			// currentLocationCheckbox.click();

			// 6. Submit the form and wait for the success alert
			// Submit the form with explicit press and release actions
			submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
			submitButton.click();

			// Wait for and handle the success alert
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();

			try {
				Thread.sleep(2000); // Pauses for 5 seconds
			} catch (InterruptedException e) {

			}

			// 7. Verify confirmation message===============================================

			driver.get(driver.getCurrentUrl());

			try {
				Thread.sleep(5000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();
			longwait.until(ExpectedConditions.alertIsPresent());
			successAlert = driver.switchTo().alert();
			successAlert.accept();

			try {
				Thread.sleep(20000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			map = longwait.until(ExpectedConditions.presenceOfElementLocated(By.id("map")));
			map.click();

			try {
				Thread.sleep(3000); // Pauses for 5 seconds
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

		} catch (Exception e) {
			// Take screenshot on failure
			// Utils.takeScreenshot(driver, "test_failure.png");
			throw e;
		}

	}

	@AfterAll
	public void tearDown() {
		if (driver != null) {
			driver.quit();
		}
	}

	public static void main(String[] args) {
		CrisisguardApplicationTests tests = new CrisisguardApplicationTests();
		tests.setUp();
		try {
			// tests.testLogin();

			tests.testViewActiveReport();

			// tests.testViewActiveReport_2();

		} finally {
			tests.tearDown();
		}
	}

}

// 131.0.6778.110
