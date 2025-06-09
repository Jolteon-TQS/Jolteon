package tqs.project.jolteon.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tqs.project.jolteon.entities.CityAdmin;
import tqs.project.jolteon.services.CityAdminService;
import tqs.project.jolteon.services.CulturalLandmarkService;

import tqs.project.jolteon.entities.DTOs.CulturalLandmarkDTO;
import tqs.project.jolteon.entities.DTOs.CulturalLandmarkMapper;

import java.util.List;

@RestController
@RequestMapping("/api/city-admin")
public class CityAdminController {

    private final CityAdminService cityAdminService;
    private final CulturalLandmarkService culturalLandmarkService;

    public CityAdminController(CityAdminService cityAdminService, CulturalLandmarkService culturalLandmarkService) {
        this.cityAdminService = cityAdminService;
        this.culturalLandmarkService = culturalLandmarkService;
    }

    @PostMapping
    public ResponseEntity<CityAdmin> addCityAdmin(@RequestBody CityAdmin cityAdmin) {
        return ResponseEntity.ok(cityAdminService.addCityAdmin(cityAdmin));

    }

    @GetMapping
    public ResponseEntity<List<CityAdmin>> getAllCityAdmins() {
        List<CityAdmin> admins = cityAdminService.getAllCityAdmins();
        return ResponseEntity.ok(admins);
    }


    @GetMapping("/{id}/cultural-landmarks")
    public ResponseEntity<List<CulturalLandmarkDTO>> getCulturalLandmarkByCityAdminId(@PathVariable Long id) {
        CityAdmin cityAdmin = cityAdminService.getCityAdminById(id);
        if (cityAdmin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(null);
        }
        List<CulturalLandmarkDTO> dtos = culturalLandmarkService.getCulturalLandmarksByCity(cityAdmin.getCity())
                .stream()
                .map(CulturalLandmarkMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
