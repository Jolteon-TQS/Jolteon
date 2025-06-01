package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.CityAdmin;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CityAdminRepository extends JpaRepository<CityAdmin, Long> {
    Optional<CityAdmin> findByEmail(String email);
}
