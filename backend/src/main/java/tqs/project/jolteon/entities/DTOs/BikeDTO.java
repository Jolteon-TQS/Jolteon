package tqs.project.jolteon.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BikeDTO {
    private Long id;
    private Integer autonomy;
    private Boolean isAvailable;
    private Double latitude;
    private Double longitude;
    private String city;
    private Long chargingSpotId;
}
