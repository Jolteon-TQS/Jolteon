package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
public class BikeRenting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Bike bike;

    @ManyToOne
    private NormalUser user;

    @ManyToMany
    private Set<CulturalLandmark> culturalLandmarks;

    @ManyToOne
    private ChargingSpot startSpot;

    @ManyToOne
    private ChargingSpot endSpot;

    
    private LocalDateTime time;
    private LocalDateTime endTime;
}
