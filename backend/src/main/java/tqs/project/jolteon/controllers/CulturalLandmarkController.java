package tqs.project.jolteon.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.DTOs.CulturalLandmarkDTO;
import tqs.project.jolteon.entities.DTOs.CulturalLandmarkMapper;
import tqs.project.jolteon.services.CulturalLandmarkService;

@RestController
@RequestMapping("/api/cultural-landmarks")
public class CulturalLandmarkController {

    private final CulturalLandmarkService culturalLandmarkService;

    public CulturalLandmarkController(CulturalLandmarkService culturalLandmarkService) {
        this.culturalLandmarkService = culturalLandmarkService;
    }

    @PostMapping 
    public ResponseEntity<CulturalLandmarkDTO> addCulturalLandmark(@RequestBody CulturalLandmarkDTO culturalLandmarkDTO) {
        CulturalLandmark saved = culturalLandmarkService.addCulturalLandmark(CulturalLandmarkMapper.toEntity(culturalLandmarkDTO));
        return ResponseEntity.ok(CulturalLandmarkMapper.toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCulturalLandmark(@PathVariable Long id) {
        culturalLandmarkService.deleteCulturalLandmark(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CulturalLandmarkDTO>> getAllCulturalLandmarks() {
        List<CulturalLandmarkDTO> dtos = culturalLandmarkService.getAllCulturalLandmarks()
                .stream()
                .map(CulturalLandmarkMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CulturalLandmarkDTO> getCulturalLandmarkById(@PathVariable Long id) {
        CulturalLandmark landmark = culturalLandmarkService.getCulturalLandmarkById(id);
        CulturalLandmarkDTO dto = CulturalLandmarkMapper.toDTO(landmark);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CulturalLandmarkDTO> updateCulturalLandmark(@PathVariable Long id, @RequestBody CulturalLandmarkDTO culturalLandmarkDTO) {
        CulturalLandmark updated = culturalLandmarkService.updateCulturalLandmark(CulturalLandmarkMapper.toEntity(culturalLandmarkDTO));
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(CulturalLandmarkMapper.toDTO(updated));
    }
}
