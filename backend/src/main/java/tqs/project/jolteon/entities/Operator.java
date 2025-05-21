package tqs.project.jolteon.entities;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Operator extends BaseUser {
    private String city;
}
