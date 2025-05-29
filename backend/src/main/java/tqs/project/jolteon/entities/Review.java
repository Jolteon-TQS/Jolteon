package tqs.project.jolteon.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    @JsonBackReference
    private NormalUser user;
    
    @JsonProperty("user")
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    @ManyToOne
    @JoinColumn(name = "culturalLandmark_id")
    @JsonIgnore
    @JsonBackReference
    private CulturalLandmark culturalLandmark;

    @JsonProperty("culturalLandmark")
    public Long getCulturalLandmarkId() {
        return culturalLandmark != null ? culturalLandmark.getId() : null;
    }

    private int stars;
    private String description;
}
