package tqs.project.jolteon.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.entities.DTOs.BikeRentingDTO;
import tqs.project.jolteon.services.BikeRentingService;
import tqs.project.jolteon.entities.DTOs.BikeRentingMapper;
import java.util.List;

@RestController
@RequestMapping("/api/rentings")
@RequiredArgsConstructor
public class BikeRentingController {

    private final BikeRentingService bikeRentingService;

    @GetMapping("/active/{userId}")
    public ResponseEntity<BikeRentingDTO> getActiveRenting(@PathVariable Long userId) {
        return bikeRentingService.getActiveRentingForUser(userId)
                .map(BikeRentingMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @GetMapping
    public ResponseEntity<List<BikeRentingDTO>> getAllRentings() {
        List<BikeRentingDTO> dtos = bikeRentingService.getAllRentings()
            .stream()
            .map(BikeRentingMapper::toDTO)
            .toList();

        return ResponseEntity.ok(dtos);
    }


}
