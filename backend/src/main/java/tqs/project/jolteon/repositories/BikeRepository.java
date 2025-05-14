package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.Bike;

public interface BikeRepository extends JpaRepository<Bike, Long> {
}
