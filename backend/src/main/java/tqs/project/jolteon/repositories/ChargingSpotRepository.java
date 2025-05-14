package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.ChargingSpot;

public interface ChargingSpotRepository extends JpaRepository<ChargingSpot, Long> {
}
