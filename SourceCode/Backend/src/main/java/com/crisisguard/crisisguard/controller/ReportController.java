package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import com.crisisguard.crisisguard.repository.ReportRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/report")
public class ReportController {
    ReportRepository reportRepository;

    public ReportController(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /** Create **/

    @PostMapping("/create")
    public void createReport(@RequestBody Report report) {
        reportRepository.addReport(report);
    }

    /** Read **/

    @GetMapping("/{userID}/{timeStart}/{coords}/{typeDisID}")
    public Report getReport(@PathVariable int userID, @PathVariable String timeStart, @PathVariable String coords, @PathVariable String typeDisID) {
        var report = reportRepository.getReport(userID, Date.valueOf(timeStart), coords, typeDisID);

        if (report == null) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(404), "Report not found");
        }

        return report;
    }

    @GetMapping("/byUser/{userID}")
    public List<Report> getReportsByUser(@PathVariable int userID) {
        var reports = reportRepository.getReportsByUserID(userID);

        if (reports == null) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(404), "Report not found");
        }

        return reports;
    }

    @GetMapping("/bySeverity/{severity}")
    public List<Report> getReportsBySeverity(@PathVariable int severity) {
        var reports = reportRepository.getReportsBySeverity(Severity.values()[severity]);

        if (reports == null) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(404), "Report not found");
        }

        return reports;
    }

    @GetMapping("/dateRange/{start}/{end}")
    public List<Report> getReportsByDateRange(@PathVariable String start, @PathVariable String end) {
        var reports = reportRepository.getReportsByDateRange(Date.valueOf(start), Date.valueOf(end));

        if (reports == null) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(404), "Report not found");
        }

        return reports;
    }

    /** Update **/

    @PutMapping("/update")
    public void updateReport(@RequestBody Report report) {
        try {
            reportRepository.updateReport(report);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }

    /** Delete **/

    @DeleteMapping("/delete/{userID}/{timeStart}/{coords}/{typeDisID}")
    public void deleteReport(@PathVariable int userID, @PathVariable String timeStart, @PathVariable String coords, @PathVariable String typeDisID) {
        try {
            reportRepository.deleteReport(userID, Date.valueOf(timeStart), coords, typeDisID);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }
}
