package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Set;

@Entity
@Getter
@Setter
public class ChargingSpot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private float latitude;
    private float longitude;
    private int capacity;

    @OneToMany
    (cascade = CascadeType.ALL, mappedBy = "chargingSpot")
    @JsonManagedReference
    private Set<Bike> bikes;
}
