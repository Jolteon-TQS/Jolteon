package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.BikeRenting;
import org.springframework.stereotype.Repository;

@Repository
public interface BikeRentingRepository extends JpaRepository<BikeRenting, Long> {
}
