package tqs.project.jolteon.entities;

import com.fasterxml.jackson.annotation.JsonProperty;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass 
@Getter
@Setter
public abstract class BaseUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("user_id")  
    protected Long id;

    protected String username;
    protected String email;
}
