package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.ChargingSpot;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChargingSpotRepository extends JpaRepository<ChargingSpot, Long> {
    // Custom query method to find charging spots by city
    List<ChargingSpot> findByCity(String city);
}
