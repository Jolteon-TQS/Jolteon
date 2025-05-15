package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.BikeAlert;
import org.springframework.stereotype.Repository;

@Repository
public interface BikeAlertRepository extends JpaRepository<BikeAlert, Long> {
}
