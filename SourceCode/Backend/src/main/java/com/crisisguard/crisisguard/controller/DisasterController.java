package com.crisisguard.crisisguard.controller;

import com.crisisguard.crisisguard.models.Disaster;
import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.repository.DisasterRepository;
import com.crisisguard.crisisguard.repository.PlaceRepository;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;

@RestController
@RequestMapping("/disaster")
public class DisasterController {
    DisasterRepository disasterRepository;

    public DisasterController(DisasterRepository disasterRepository) {
        this.disasterRepository = disasterRepository;
    }

    /** Create **/

    @PostMapping("/create")
    public void createDisaster(@RequestBody Disaster disaster) {
        disasterRepository.addDisaster(disaster);
    }

    /** Read **/

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
    public void updatePlace(@RequestBody Disaster disaster) {
        try {
            disasterRepository.updateDisaster(disaster);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }

    /** Delete **/

    @DeleteMapping("/delete/{time_start}/{coords}/{type_dis_id}")
    public void deletePlace(@PathVariable String coords, @PathVariable String time_start, @PathVariable String type_dis_id) {
        try {
            disasterRepository.deleteDisaster(Date.valueOf(time_start), coords, type_dis_id);
        }
        catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(400), e.getMessage());
        }
    }
}
