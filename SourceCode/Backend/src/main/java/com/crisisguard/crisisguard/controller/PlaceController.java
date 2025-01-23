package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.auth.CheckRole;
import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.repository.PlaceRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/place")
public class PlaceController {
    CheckRole checkRole;
    PlaceRepository placeRepository;

    public PlaceController(PlaceRepository placeRepository, CheckRole checkRole) {
        this.checkRole = checkRole;
        this.placeRepository = placeRepository;
    }

    /** Create **/

    @PostMapping("/create")
    public void createPlace(@RequestBody Place place, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isOrganization(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

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

    @GetMapping("/")
    public List<Place> getPlaces() {
        return placeRepository.getPlaces();
    }

    /** Update **/

    @PutMapping("/update")
    public void updatePlace(@RequestBody Place place, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isOrganization(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        try {
            placeRepository.updatePlace(place);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }

    /** Delete **/

    @DeleteMapping("/delete/{coords}")
    public void deletePlace(@PathVariable String coords, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isOrganization(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        try {
            placeRepository.deletePlace(coords);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }
}