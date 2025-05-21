package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CulturalLandmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private String description;

    // @Lob
    // private byte[] image;

    private String imageUrl;

    private float latitude;
    private float longitude;
}
