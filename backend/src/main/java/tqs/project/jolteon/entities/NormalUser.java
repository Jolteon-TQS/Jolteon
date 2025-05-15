package tqs.project.jolteon.entities;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class NormalUser extends BaseUser {
    private Long balance;
}
