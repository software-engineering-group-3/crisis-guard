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

    @GetMapping("/{coords}")
    public Place getPlace(@PathVariable String coords) {
        var place = placeRepository.getPlace(coords);

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

    @DeleteMapping("/delete/{coords}")
    public void deletePlace(@PathVariable String coords) {
        try {
            placeRepository.deletePlace(coords);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }
}