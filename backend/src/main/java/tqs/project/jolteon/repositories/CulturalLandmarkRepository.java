package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.CulturalLandmark;
import org.springframework.stereotype.Repository;

@Repository
public interface CulturalLandmarkRepository extends JpaRepository<CulturalLandmark, Long> {
}
