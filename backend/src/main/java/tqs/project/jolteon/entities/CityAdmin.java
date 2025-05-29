package tqs.project.jolteon.entities;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "city_admin")
public class CityAdmin extends BaseUser {
    private String city;
}
