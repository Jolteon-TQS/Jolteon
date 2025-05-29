package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.CulturalLandmark;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CulturalLandmarkRepository extends JpaRepository<CulturalLandmark, Long> {

    List<CulturalLandmark> findByCity(String city);
}
