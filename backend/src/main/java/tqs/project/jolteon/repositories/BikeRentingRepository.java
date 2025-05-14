package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.BikeRenting;

public interface BikeRentingRepository extends JpaRepository<BikeRenting, Long> {
}
