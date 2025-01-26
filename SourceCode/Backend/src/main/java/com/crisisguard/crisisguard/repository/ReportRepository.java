package com.crisisguard.crisisguard.repository;

import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.Date;
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
        if (getReport(report.usr_id(), report.time_start(), report.coords(), report.type_dis_id()) != null) {
            throw new IllegalArgumentException("Report already exists");
        }

        jdbcClient.sql("INSERT INTO report VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                .param(report.report_severity().ordinal())
                .param(report.desc_report())
                .param(report.photo())
                .param(report.usr_id())
                .param(report.time_start())
                .param(report.coords())
                .param(report.type_dis_id())
                .update();
    }

    /** Read **/

    public Report getReport(int usr_id, java.sql.Date time_start, String coords, String type_dis_id) {
        try {
            var result = jdbcClient.sql("SELECT * FROM report WHERE usr_id = ? AND time_start = ? AND coords = ? AND type_dis_id = ?")
                    .param(usr_id)
                    .param(time_start)
                    .param(coords)
                    .param(type_dis_id)
                    .query().singleRow();

            return getReportModelFromDB(result);
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Report> getReportsByUserID(int usrID) {
        try {
            var results = jdbcClient.sql("SELECT * FROM report WHERE usr_id = ?")
                    .param(usrID)
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
            var results = jdbcClient.sql("SELECT * FROM report WHERE report_severity = ?")
                    .param(severity.ordinal())
                    .query().listOfRows();

            // Convert the list to a list of Report objects
            return results.stream().map(this::getReportModelFromDB).collect(Collectors.toList());
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<Report> getReportsByDateRange(Date startTime, Date endTime) {
        try {
            var results = jdbcClient.sql("SELECT * FROM report WHERE time_start >= ? AND time_start <= ?")
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

    public List<Report> getReports() {
        try {
            var results = jdbcClient.sql("SELECT * FROM report")
                    .query().listOfRows();

            // Convert the list to a list of Report objects
            return results.stream().map(this::getReportModelFromDB).collect(Collectors.toList());
        }
        catch (EmptyResultDataAccessException e) {
            return List.of();
        }
    }

    /** Update **/

    public void updateReport(Report report) {
        if (getReport(report.usr_id(), report.time_start(), report.coords(), report.type_dis_id()) == null) {
            throw new IllegalArgumentException("Report does not exist");
        }

        jdbcClient.sql("UPDATE report SET report_severity = ?, desc_report = ?, photo = ? WHERE usr_id = ? AND time_start = ? AND coords = ? AND type_dis_id = ?")
                .param(report.report_severity().ordinal())
                .param(report.desc_report())
                .param(report.photo())
                .param(report.usr_id())
                .param(report.time_start())
                .param(report.coords())
                .param(report.type_dis_id())
                .update();
    }

    /** Delete **/

    public void deleteReport(int usrID, Date timeStart, String coords, String typeDisID) {
        if (getReport(usrID, timeStart, coords, typeDisID) == null) {
            throw new IllegalArgumentException("Report does not exist");
        }

        jdbcClient.sql("DELETE FROM report WHERE usr_id = ? AND time_start = ? AND coords = ? AND type_dis_id = ?")
                .param(usrID)
                .param(timeStart)
                .param(coords)
                .param(typeDisID)
                .update();
    }

    /** Helper methods **/

    public Report getReportModelFromDB(Map<String, Object> dbRepresentation) {
        return new Report(
                Severity.values()[(int)dbRepresentation.get("report_severity")],
                (String) dbRepresentation.get("desc_report"),
                (String) dbRepresentation.get("photo"),
                (int) dbRepresentation.get("usr_id"),
                (Date) dbRepresentation.get("time_start"),
                (String) dbRepresentation.get("coords"),
                (String) dbRepresentation.get("type_dis_id")
        );
    }
}
