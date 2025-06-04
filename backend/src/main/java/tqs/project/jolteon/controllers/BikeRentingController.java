package tqs.project.jolteon.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.entities.DTOs.BikeRentingDTO;
import tqs.project.jolteon.services.BikeRentingService;
import tqs.project.jolteon.entities.DTOs.BikeRentingMapper;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import tqs.project.jolteon.entities.BikeRenting;



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

    @PostMapping
    public ResponseEntity<BikeRentingDTO> createRenting(@RequestBody BikeRentingDTO bikeRentingDTO) {
        Long bikeId = bikeRentingDTO.getBike().getId();
        Long userId = bikeRentingDTO.getUser().getId();
        Long startSpotId = bikeRentingDTO.getStartSpot() != null ? bikeRentingDTO.getStartSpot().getId() : null;
        Long endSpotId = bikeRentingDTO.getEndSpot() != null ? bikeRentingDTO.getEndSpot().getId() : null;
        Set<Long> landmarkIds = bikeRentingDTO.getCulturalLandmarks() != null
                ? bikeRentingDTO.getCulturalLandmarks().stream()
                        .map(landmark -> landmark.getId())
                        .collect(Collectors.toSet())
                : null;
        LocalDateTime time = bikeRentingDTO.getTime();
        LocalDateTime endTime = bikeRentingDTO.getEndTime();
        BikeRenting bikeRenting = bikeRentingService.createBikeRenting(
                bikeId, userId, startSpotId, endSpotId, landmarkIds, time, endTime);

        BikeRentingDTO createdDto = BikeRentingMapper.toDTO(bikeRenting);
        return ResponseEntity.ok(createdDto);
    }

    @PutMapping("{rentingId}/end")
    public ResponseEntity<BikeRentingDTO> endRenting(
            @PathVariable Long rentingId,
            @RequestParam Long endSpotId) {
        BikeRenting updatedRenting = bikeRentingService.endBikeRenting(rentingId, endSpotId);
        BikeRentingDTO updatedDto = BikeRentingMapper.toDTO(updatedRenting);
        return ResponseEntity.ok(updatedDto);
    }

}
