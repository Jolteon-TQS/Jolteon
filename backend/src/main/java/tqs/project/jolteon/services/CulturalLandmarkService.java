package tqs.project.jolteon.services;

import org.springframework.stereotype.Service;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.repositories.CulturalLandmarkRepository;

import java.util.List;




@Service
public class CulturalLandmarkService {

    private final CulturalLandmarkRepository culturalLandmarkRepository;

    public CulturalLandmarkService(CulturalLandmarkRepository culturalLandmarkRepository) {
        this.culturalLandmarkRepository = culturalLandmarkRepository;
    }

    public CulturalLandmark addCulturalLandmark(CulturalLandmark culturalLandmark) {
        return culturalLandmarkRepository.save(culturalLandmark);
    }

    public void deleteCulturalLandmark(Long id) {
        culturalLandmarkRepository.deleteById(id);
    }

    public List<CulturalLandmark> getAllCulturalLandmarks() {
        return culturalLandmarkRepository.findAll();
    }

    public CulturalLandmark getCulturalLandmarkById(Long id) {
        return culturalLandmarkRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cultural landmark not found with id: " + id));
    }

    public List<CulturalLandmark> getCulturalLandmarksByCity(String city) {
        return culturalLandmarkRepository.findByCity(city);
    }

    public CulturalLandmark updateCulturalLandmark(CulturalLandmark culturalLandmark) {
        if (!culturalLandmarkRepository.existsById(culturalLandmark.getId())) {
            throw new IllegalArgumentException("Cultural landmark not found with id: " + culturalLandmark.getId());
        }
        return culturalLandmarkRepository.save(culturalLandmark);
    }
}
