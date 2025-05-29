package tqs.project.jolteon.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CulturalLandmarkDTO {
    private Long id;
    private String name;
    private String city;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Set<ReviewDTO> reviews; 
}
