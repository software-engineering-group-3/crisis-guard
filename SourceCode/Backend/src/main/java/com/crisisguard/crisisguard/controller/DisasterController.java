package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.auth.CheckRole;
import com.crisisguard.crisisguard.models.Disaster;
import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.repository.DisasterRepository;
import com.crisisguard.crisisguard.repository.PlaceRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/disaster")
public class DisasterController {
    DisasterRepository disasterRepository;
    CheckRole checkRole;

    public DisasterController(DisasterRepository disasterRepository, CheckRole checkRole) {
        this.checkRole = checkRole;
        this.disasterRepository = disasterRepository;
    }

    /** Create **/

    @PostMapping("/create")
    public void createDisaster(@RequestBody Disaster disaster, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isAuthority(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        disasterRepository.addDisaster(disaster);
    }

    /** Read **/

    @GetMapping("/")
    public List<Disaster> getDisasters() {
        return disasterRepository.getDisasters();
    }

    @GetMapping("/{time_start}/{coords}/{type_dis_id}")
    public Disaster getDisaster(@PathVariable String time_start, @PathVariable String coords, @PathVariable String type_dis_id) {
        var disaster = disasterRepository.getDisaster(Date.valueOf(time_start), coords, type_dis_id);

        if (disaster == null) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(404), "Place not found");
        }

        return disaster;
    }

    /** Update **/

    @PutMapping("/update")
    public void updatePlace(@RequestBody Disaster disaster, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isAuthority(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        try {
            disasterRepository.updateDisaster(disaster);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }

    /** Delete **/

    @DeleteMapping("/delete/{time_start}/{coords}/{type_dis_id}")
    public void deletePlace(@PathVariable String coords, @PathVariable String time_start, @PathVariable String type_dis_id, @AuthenticationPrincipal OAuth2User user) {
        if (!checkRole.isAuthority(user)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "You are not authorized to perform this action");
        }

        try {
            disasterRepository.deleteDisaster(Date.valueOf(time_start), coords, type_dis_id);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }
}
