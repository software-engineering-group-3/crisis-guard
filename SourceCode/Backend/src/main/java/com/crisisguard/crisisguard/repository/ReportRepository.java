package com.crisisguard.crisisguard.repository;

import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class ReportRepository {
    private final JdbcClient jdbcClient;

    public ReportRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /** Create **/

    public void addReport(Report report) {
        if (getReportByID(report.reportID()) != null) {
            throw new IllegalArgumentException("Report already exists");
        }

        jdbcClient.sql("INSERT INTO report (user_id, report_id, place_id, report_time, disaster_type_id, photo_url, description, severity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                .param(report.userID())
                .param(report.reportID())
                .param(report.placeID())
                .param(report.time())
                .param(report.disasterTypeID())
                .param(report.photoURL())
                .param(report.description())
                .param(report.severity().ordinal())
                .update();
    }

    /** Read **/

    public Report getReportByID(int reportID) {
        try {
            var result = jdbcClient.sql("SELECT * FROM report WHERE report_id = ?")
                    .param(reportID)
                    .query().singleRow();

            return getReportModelFromDB(result);
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Report> getReportsByUserID(int userID) {
        try {
            var results = jdbcClient.sql("SELECT * FROM report WHERE user_id = ?")
                    .param(userID)
                    .query().listOfRows();

            // Convert the list to a list of Report objects
            return results.stream().map(this::getReportModelFromDB).collect(Collectors.toList());
        }
            catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Report> getReportsBySeverity(Severity severity) {
        try {
            var results = jdbcClient.sql("SELECT * FROM report WHERE severity = ?")
                    .param(severity.ordinal())
                    .query().listOfRows();

            // Convert the list to a list of Report objects
            return results.stream().map(this::getReportModelFromDB).collect(Collectors.toList());
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Report> getReportsByDateRange(Timestamp startTime, Timestamp endTime) {
        try {
            var results = jdbcClient.sql("SELECT * FROM report WHERE report_time >= ? AND report_time <= ?")
                    .param(startTime)
                    .param(endTime)
                    .query().listOfRows();

            // Convert the list to a list of Report objects
            return results.stream().map(this::getReportModelFromDB).collect(Collectors.toList());
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /** Update **/

    public void updateReport(Report report) {
        if (getReportByID(report.reportID()) == null) {
            throw new IllegalArgumentException("Report does not exist");
        }

        jdbcClient.sql("UPDATE report SET user_id = ?, place_id = ?, report_time = ?, disaster_type_id = ?, photo_url = ?, description = ?, severity = ? WHERE report_id = ?")
                .param(report.userID())
                .param(report.placeID())
                .param(report.time())
                .param(report.disasterTypeID())
                .param(report.photoURL())
                .param(report.description())
                .param(report.severity().ordinal())
                .param(report.reportID())
                .update();
    }

    /** Delete **/

    public void deleteReport(int reportID) {
        if (getReportByID(reportID) == null) {
            throw new IllegalArgumentException("Report does not exist");
        }

        jdbcClient.sql("DELETE FROM report WHERE report_id = ?")
                .param(reportID)
                .update();
    }

    /** Helper methods **/

    public Report getReportModelFromDB(Map<String, Object> dbRepresentation) {
        return new Report(
                (int) dbRepresentation.get("user_id"),
                (int) dbRepresentation.get("report_id"),
                (int) dbRepresentation.get("place_id"),
                (Timestamp) dbRepresentation.get("report_time"),
                (int) dbRepresentation.get("disaster_type_id"),
                (String) dbRepresentation.get("photo_url"),
                (String) dbRepresentation.get("description"),
                Severity.values()[(int)dbRepresentation.get("severity")]
        );
    }
}
