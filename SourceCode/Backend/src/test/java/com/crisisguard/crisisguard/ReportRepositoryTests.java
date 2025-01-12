package com.crisisguard.crisisguard;

import com.crisisguard.crisisguard.config.DatabaseInitializer;
import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import com.crisisguard.crisisguard.repository.ReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class ReportRepositoryTests {
    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    private JdbcClient jdbcClient;

    @MockBean
    private DatabaseInitializer databaseInitializer;

    @Mock
    private JdbcClient.StatementSpec statementSpec;

    @Mock
    private JdbcClient.ResultQuerySpec querySpec;

    // Tests the factory function converting the database model of Reports to the application model
    @Test
    void getReportModelFromDB() {
        Map<String, Object> test = Map.of(
                "report_severity", 6,
                "desc_report", "Test report",
                "photo", "photo.jpg",
                "usr_id", 5,
                "time_start", Date.valueOf("2021-01-01"),
                "coords", "55.7558 N, 37.6176 E",
                "type_dis_id", "1"
        );

        var testObj = new Report(
                Severity.CRITICAL,
                "Test report",
                "photo.jpg",
                1,
                Date.valueOf("2021-01-01"),
                "55.7558 N, 37.6176 E",
                "1"
        );

        var reportRepository = new ReportRepository(jdbcClient);
        var result = reportRepository.getReportModelFromDB(test);

        assertEquals(result, testObj);
    }

    // Tests interaction with JDBC client to get multiple reports by user ID
    @Test
    void getReportsByUserID() {
        Map<String, Object> test = Map.of(
                "report_severity", 6,
                "desc_report", "Test report",
                "photo", "photo.jpg",
                "usr_id", 5,
                "time_start", Date.valueOf("2021-01-01"),
                "coords", "55.7558 N, 37.6176 E",
                "type_dis_id", "1"
        );

        Map<String, Object> test2 = Map.of(
                "report_severity", 2,
                "desc_report", "Test report 2",
                "photo", "photo2.jpg",
                "usr_id", 5,
                "time_start", Date.valueOf("2022-01-01"),
                "coords", "51.7558 N, 37.6176 E",
                "type_dis_id", "2"
        );

        when(jdbcClient.sql("SELECT * FROM report WHERE usr_id = ?")).thenReturn(statementSpec);
        when(statementSpec.param(5)).thenReturn(statementSpec);
        when(statementSpec.query()).thenReturn(querySpec);
        when(querySpec.listOfRows()).thenReturn((List<Map<String, Object>>) List.of(test, test2));

        var reportRepository = new ReportRepository(jdbcClient);
        var result = reportRepository.getReportsByUserID(5);

        assertEquals(result.size(), 2);
        assertEquals(result.get(0), new Report(
                Severity.CRITICAL,
                "Test report",
                "photo.jpg",
                5,
                Date.valueOf("2021-01-01"),
                "55.7558 N, 37.6176 E",
                "1"
        ));
        assertEquals(result.get(1), new Report(
                Severity.LOW,
                "Test report 2",
                "photo2.jpg",
                5,
                Date.valueOf("2022-01-01"),
                "51.7558 N, 37.6176 E",
                "2"
        ));
    }
}