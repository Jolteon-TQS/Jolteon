package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ChargingSpot ending;

    @OneToOne
    private BikeRenting bikerenting;

    @ManyToMany
    private Set<CulturalLandmark> spotsToVisit;
}

