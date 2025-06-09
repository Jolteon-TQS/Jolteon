package tqs.project.jolteon.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.entities.DTOs.BikeDTO;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.entities.DTOs.BikeMapper;
import tqs.project.jolteon.services.BikeService;
import tqs.project.jolteon.services.ChargingSpotService;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    private final BikeService bikeService;
    private final ChargingSpotService chargingSpotService;

    public BikeController(BikeService bikeService, ChargingSpotService chargingSpotService) {
        this.bikeService = bikeService;
        this.chargingSpotService = chargingSpotService;
    }

    @GetMapping
    public ResponseEntity<List<BikeDTO>> getAllBikes() {
        List<BikeDTO> dtos = bikeService.getAllBikes()
                .stream()
                .map(BikeMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<BikeDTO>> searchBikes(@RequestParam String city) {
        List<BikeDTO> dtos = bikeService.getAllBikes().stream()
                .filter(bike -> bike.getCity().equalsIgnoreCase(city))
                .map(BikeMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BikeDTO> getBikeById(@PathVariable Long id) {
        return bikeService.getBikeById(id)
                .map(BikeMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public ResponseEntity<List<BikeDTO>> getAvailableBikesNearLocation(
            @RequestParam float latitude,
            @RequestParam float longitude) {
        List<BikeDTO> dtos = bikeService.getAvailableBikesNearLocation(latitude, longitude)
                .stream()
                .map(BikeMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<BikeDTO> createBike(@RequestBody BikeDTO bikeDTO) {
        ChargingSpot spot = chargingSpotService.getChargingSpotById(bikeDTO.getChargingSpotId());

        Bike saved = bikeService.saveBike(BikeMapper.toEntity(bikeDTO, spot));
        return ResponseEntity.ok(BikeMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BikeDTO> updateBike(@PathVariable Long id, @RequestBody BikeDTO updatedDTO) {
        try {
            ChargingSpot spot = chargingSpotService.getChargingSpotById(updatedDTO.getChargingSpotId());
            Bike updated = bikeService.updateBike(id, BikeMapper.toEntity(updatedDTO, spot));
            return ResponseEntity.ok(BikeMapper.toDTO(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBike(@PathVariable Long id) {
        bikeService.deleteBike(id);
        return ResponseEntity.noContent().build();
    }
}

