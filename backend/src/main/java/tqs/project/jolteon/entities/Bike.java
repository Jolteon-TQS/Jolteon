package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Bike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer autonomy;
    private Boolean isAvailable;
    private Double latitude;
    private Double longitude;
    private String city;

    @ManyToOne
    @JoinColumn(name = "charging_spot_id")
    private ChargingSpot chargingSpot;

}
