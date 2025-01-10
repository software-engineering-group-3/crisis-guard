package com.crisisguard.crisisguard.repository;

import com.crisisguard.crisisguard.models.Disaster;
import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.Map;

@Repository
public class DisasterRepository {
    private final JdbcClient jdbcClient;

    public DisasterRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /** Create **/

    public void addDisaster(Disaster disaster) {
        if (getDisaster(disaster.time_start(), disaster.coords(), disaster.type_dis_id()) != null) {
            throw new IllegalArgumentException("Disaster already exists");
        }

        jdbcClient.sql("INSERT INTO disaster VALUES (?, ?, ?, ?, ?, ?)")
                .param(disaster.time_end())
                .param(disaster.time_start())
                .param(disaster.severity())
                .param(disaster.area_size())
                .param(disaster.coords())
                .param(disaster.type_dis_id())
                .update();
    }

    /** Read **/

    public Disaster getDisaster(Date timeStart, String coords, String typeDisID) {
        try {
            var result = jdbcClient.sql("SELECT * FROM disaster WHERE time_start = ? AND coords = ? AND type_dis_id = ?")
                    .param(timeStart)
                    .param(coords)
                    .param(typeDisID)
                    .query().singleRow();

            return getDisasterModelFromDB(result);
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    /** Update **/

    public void updateDisaster(Disaster disaster) {
        if (getDisaster(disaster.time_start(), disaster.coords(), disaster.type_dis_id()) == null) {
            throw new IllegalArgumentException("Disaster does not exist");
        }

        jdbcClient.sql("UPDATE disaster SET time_end = ?, time_start = ?, severity = ?, area_size = ?, type_dis_id = ? WHERE coords = ?")
                .param(disaster.time_end())
                .param(disaster.time_start())
                .param(disaster.severity())
                .param(disaster.area_size())
                .param(disaster.type_dis_id())
                .param(disaster.coords())
                .update();
    }

    /** Delete **/

    public void deleteDisaster(Date timeStart, String coords, String typeDisID) {
        if (getDisaster(timeStart, coords, typeDisID) == null) {
            throw new IllegalArgumentException("Disaster does not exist");
        }

        jdbcClient.sql("DELETE FROM disaster WHERE time_start = ? AND coords = ? AND type_dis_id = ?")
                .param(timeStart)
                .param(coords)
                .param(typeDisID)
                .update();
    }

    private Disaster getDisasterModelFromDB(Map<String, Object> result) {
        return new Disaster(
                (Date) result.get("time_end"),
                (Date) result.get("time_start"),
                Severity.values()[(int) result.get("severity")],
                (int) result.get("area_size"),
                (String) result.get("coords"),
                (String) result.get("type_dis_id")
        );
    }
}
