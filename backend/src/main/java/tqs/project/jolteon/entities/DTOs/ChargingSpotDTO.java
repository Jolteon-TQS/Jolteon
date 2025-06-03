package tqs.project.jolteon.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChargingSpotDTO {
    private Long id;
    private String city;
    private float latitude;
    private float longitude;
    private Set<BikeDTO> bikes; 
}
