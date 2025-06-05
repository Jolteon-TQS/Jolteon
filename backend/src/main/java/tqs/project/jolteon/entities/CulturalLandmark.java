package tqs.project.jolteon.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;
import java.util.HashSet;

@Entity
@Getter
@Setter
@Table(name = "cultural_landmark")
public class CulturalLandmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("cultural_landmark_id")  
    private Long id;

    private String name;
    private String city;
    private String description;
    private String imageUrl;

    private Double latitude;
    private Double longitude;

    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true, mappedBy = "culturalLandmark")
    @JsonManagedReference
    private Set<Review> reviews = new HashSet<>();
}


