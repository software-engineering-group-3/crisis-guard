package com.crisisguard.crisisguard.repository;

import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.models.Report;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class PlaceRepository {
    private final JdbcClient jdbcClient;

    public PlaceRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /** Create **/

    public void addPlace(Place place) {
        if (getPlace(place.coords()) != null) {
            throw new IllegalArgumentException("Place already exists");
        }

        jdbcClient.sql("INSERT INTO place VALUES (?, ?, ?, ?, ?)")
                .param(place.coords())
                .param(place.house_num())
                .param(place.type_place_id())
                .param(place.post_num())
                .param(place.name_street())
                .update();
    }

    /** Read **/

    public Place getPlace(String coords) {
        try {
            var result = jdbcClient.sql("SELECT * FROM place WHERE coords = ?")
                    .param(coords)
                    .query().singleRow();

            return getPlaceModelFromDB(result);
        }
        catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Place getPlaceFromReport(Report report) {
        return getPlace(report.coords());
    }

    /** Update **/

    public void updatePlace(Place place) {
        if (getPlace(place.coords()) == null) {
            throw new IllegalArgumentException("Place does not exist");
        }

        try {
            jdbcClient.sql("UPDATE place SET house_num = ?, type_place_id = ?, post_num = ?, name_street = ? WHERE coords = ?")
                    .param(place.house_num())
                    .param(place.type_place_id())
                    .param(place.post_num())
                    .param(place.name_street())
                    .update();
        }
        catch (EmptyResultDataAccessException e) {
            throw new IllegalArgumentException("Place does not exist");
        }
    }

    /** Delete **/

    public void deletePlace(String coords) {
        if (getPlace(coords) == null) {
            throw new IllegalArgumentException("Place does not exist");
        }

        jdbcClient.sql("DELETE FROM place WHERE coords = ?")
                .param(coords)
                .update();
    }

    /** Helper methods **/

    private Place getPlaceModelFromDB(Map<String, Object> result) {
        if (result == null) {
            return null;
        }

        return new Place(
                (String) result.get("coords"),
                (int) result.get("house_num"),
                (int) result.get("type_place_id"),
                (int) result.get("post_num"),
                (String) result.get("name_street")
        );
    }
}
