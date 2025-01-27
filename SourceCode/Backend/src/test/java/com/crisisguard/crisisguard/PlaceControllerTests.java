package com.crisisguard.crisisguard;

import com.crisisguard.crisisguard.auth.CheckRole;
import com.crisisguard.crisisguard.controller.ReportController;
import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import com.crisisguard.crisisguard.repository.ReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class PlaceControllerTests {
    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    private ReportRepository reportRepository;

    @MockBean
    private CheckRole checkRole;

    // Tests if the controller successfully adds a new Report to the repository
    @Test
    void addReportToRepository() throws Exception {
        var reportController = new ReportController(reportRepository, checkRole);
        when(checkRole.isAuthority(any())).thenReturn(true);

        when(reportRepository.getReport(1, Date.valueOf("2021-01-01"), "55.7558 N, 37.6176 E", "1")).thenReturn(null);

        Report report = new Report(
                Severity.CRITICAL,
                "Test report",
                "photo.jpg",
                1,
                Date.valueOf("2021-01-01"),
                "55.7558 N, 37.6176 E",
                "1"
        );

        reportController.createReport(report);

        verify(reportRepository).addReport(report);
    }

    // Tests if the controller can successfully get an existing Report
    @Test
    void getExistingReportFromRepository() throws Exception {
        var reportController = new ReportController(reportRepository, checkRole);
        var testReport = new Report(
                Severity.CRITICAL,
                "Test report",
                "photo.jpg",
                1,
                Date.valueOf("2021-01-01"),
                "55.7558 N, 37.6176 E",
                "1"
        );
        when(checkRole.isAuthority(any())).thenReturn(true);

        reset(reportRepository);
        when(reportRepository.getReport(1, Date.valueOf("2021-01-01"), "55.7558 N, 37.6176 E", "1"))
                .thenReturn(testReport);

        try {
            var result = reportController.getReport(1, "2021-01-01", "55.7558 N, 37.6176 E", "1");
            assertEquals(testReport, result);
        } catch (Exception e) {
            assertEquals(null, e.getMessage());	// This line is here to make the test fail if the exception is thrown
        }
    }

    // Tests controller's behavior when trying to get a non-existing Report
    @Test
    void getNonExistingReportFromRepository() throws Exception {
        var reportController = new ReportController(reportRepository, checkRole);
        when(checkRole.isAuthority(any())).thenReturn(true);

        reset(reportRepository);
        when(reportRepository.getReport(999, Date.valueOf("1991-01-01"), "22.7558 N, 37.6176 E", "2"))
                .thenReturn(null);

        try {
            reportController.getReport(999, "1991-01-01", "22.7558 N, 37.6176 E", "2");
        } catch (Exception e) {
            assertEquals("404 NOT_FOUND \"Report not found\"", e.getMessage());
            return;
        }

        assertEquals(false, true);	// This line is here to make the test fail if the exception is not thrown
    }
}
