package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BikeAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private BikeRenting bikerenting;

    @Enumerated(EnumType.STRING)
    private AlertType type;

    private String description;

    public enum AlertType {
        TIME_WARNING,
        BATTERY_WARNING
    }
}

