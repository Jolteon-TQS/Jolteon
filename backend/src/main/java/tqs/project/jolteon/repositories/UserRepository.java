package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tqs.project.jolteon.entities.NormalUser;

public interface UserRepository extends JpaRepository<NormalUser, Long> {
}
