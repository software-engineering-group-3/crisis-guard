package com.crisisguard.crisisguard.repository;

import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.models.Report;
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
        if (getPlaceByID(place.placeID()) != null) {
            throw new IllegalArgumentException("Place already exists");
        }

        jdbcClient.sql("INSERT INTO place (place_id, type_place_id, latitude, longitude, desc, city_name, street, house_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
                .param(place.placeID())
                .param(place.placeTypeID())
                .param(place.latitude())
                .param(place.longitude())
                .param(place.description())
                .param(place.cityName())
                .param(place.street())
                .param(place.houseNumber())
                .update();
    }

    /** Read **/

    public Place getPlaceByID(int placeID) {
        var result = jdbcClient.sql("SELECT * FROM place WHERE place_id = ?")
                .param(placeID)
                .query().singleRow();

        return getPlaceModelFromDB(result);
    }

    public Place getPlaceFromReport(Report report) {
        return getPlaceByID(report.placeID());
    }

    /** Update **/

    public void updatePlace(Place place) {
        if (getPlaceByID(place.placeID()) == null) {
            throw new IllegalArgumentException("Place does not exist");
        }

        jdbcClient.sql("UPDATE place SET name = ?, latitude = ?, longitude = ?, address = ? WHERE place_id = ?")
                .param(place.placeTypeID())
                .param(place.latitude())
                .param(place.longitude())
                .param(place.description())
                .param(place.cityName())
                .param(place.street())
                .param(place.houseNumber())
                .update();
    }

    /** Delete **/

    public void deletePlace(int placeID) {
        if (getPlaceByID(placeID) == null) {
            throw new IllegalArgumentException("Place does not exist");
        }

        jdbcClient.sql("DELETE FROM place WHERE place_id = ?")
                .param(placeID)
                .update();
    }

    /** Helper methods **/

    private Place getPlaceModelFromDB(Map<String, Object> result) {
        if (result == null) {
            return null;
        }

        return new Place(
                (int) result.get("place_id"),
                (int) result.get("type_place_id"),
                (String) result.get("latitude"),
                (String) result.get("longitude"),
                (String) result.get("description"),
                (String) result.get("city_name"),
                (String) result.get("street"),
                (String) result.get("house_number")
        );
    }
}
