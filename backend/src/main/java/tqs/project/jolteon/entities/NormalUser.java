package tqs.project.jolteon.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "normal_user")
public class NormalUser extends BaseUser {

    private Long balance;

    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true, mappedBy = "user")
    @JsonManagedReference
    private Set<Review> reviews = new HashSet<>();
}
