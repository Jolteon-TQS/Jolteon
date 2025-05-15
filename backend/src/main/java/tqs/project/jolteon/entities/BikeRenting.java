package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class BikeRenting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Bike bike;

    @OneToOne(mappedBy = "bikerenting", cascade = CascadeType.ALL)
    private Route route;

    private LocalDateTime time;
}
