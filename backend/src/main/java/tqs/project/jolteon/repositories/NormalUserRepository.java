package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.NormalUser;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface NormalUserRepository extends JpaRepository<NormalUser, Long> {
    Optional<NormalUser> findByEmail(String email);
}
