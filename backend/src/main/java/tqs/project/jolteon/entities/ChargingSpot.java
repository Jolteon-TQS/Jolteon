package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import org.checkerframework.checker.units.qual.C;

@Entity
@Getter
@Setter
@Table(name = "charging_spot")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ChargingSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "charging_spot_id")
    @JsonProperty("id")
    private Long id;

    private String city;
    private float latitude;
    private float longitude;
    private int capacity;

    @OneToMany(cascade = {}, mappedBy = "charging_spot",  orphanRemoval = false)
    @JsonManagedReference
    private Set<Bike> bikes = new HashSet<>();
}
