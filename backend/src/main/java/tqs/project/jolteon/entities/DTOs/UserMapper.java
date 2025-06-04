package tqs.project.jolteon.entities.DTOs;

import tqs.project.jolteon.entities.BaseUser;

public class UserMapper {

    public static UserDTO toDTO(BaseUser user) {
        return new UserDTO(
            user.getId(),
            user.getUsername()
        );
    }
}