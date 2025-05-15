package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.ChargingSpot;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargingSpotRepository extends JpaRepository<ChargingSpot, Long> {
}
