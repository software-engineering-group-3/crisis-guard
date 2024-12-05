package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.repository.PlaceRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/place")
public class PlaceController {
    PlaceRepository placeRepository;

    public PlaceController(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    /** Create **/

    @PostMapping("/create")
    public void createPlace(@RequestBody Place place) {
        placeRepository.addPlace(place);
    }

    /** Read **/

    @GetMapping("/{placeID}")
    public Place getPlace(@PathVariable int placeID) {
        var place = placeRepository.getPlaceByID(placeID);

        if (place == null) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(404), "Place not found");
        }

        return place;
    }

    /** Update **/

    @PutMapping("/update")
    public void updatePlace(@RequestBody Place place) {
        try {
            placeRepository.updatePlace(place);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }

    /** Delete **/

    @DeleteMapping("/delete/{placeID}")
    public void deletePlace(@PathVariable int placeID) {
        try {
            placeRepository.deletePlace(placeID);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }
}