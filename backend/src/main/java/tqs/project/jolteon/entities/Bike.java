package tqs.project.jolteon.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "bike")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bike_id")
    @JsonProperty("id")
    private Long id;

    private Integer autonomy;
    private Boolean isAvailable;
    private Double latitude;
    private Double longitude;
    private String city;

    @ManyToOne
    @JoinColumn(name = "charging_spot_id",referencedColumnName = "charging_spot_id")
    @JsonIgnore
    private ChargingSpot charging_spot;

    @JsonProperty("charging_spot")
    public Long getChargingSpotId() {
        return charging_spot != null ? charging_spot.getId() : null;
    }

}
