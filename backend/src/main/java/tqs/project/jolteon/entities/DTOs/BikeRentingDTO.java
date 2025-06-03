package tqs.project.jolteon.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import tqs.project.jolteon.entities.NormalUser;
import java.util.Set;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BikeRentingDTO {
    private Long id;
    private BikeDTO bike;
    private UserDTO user;
    private Set<CulturalLandmarkDTO> culturalLandmarks;
    private ChargingSpotDTO startSpot;
    private ChargingSpotDTO endSpot;
    private LocalDateTime time;
    private LocalDateTime endTime;
}


