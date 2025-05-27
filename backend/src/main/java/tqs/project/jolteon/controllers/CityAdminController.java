package tqs.project.jolteon.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tqs.project.jolteon.entities.CityAdmin;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.services.CityAdminService;
import tqs.project.jolteon.services.CulturalLandmarkService;

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


    // this doesnt work, i have NO IDEA WHY, it always throws a 415 Unsupported Media Type error
    @PostMapping("/cultural-landmarks")      
    public ResponseEntity<CulturalLandmark> addCulturalLandmark(@RequestBody CulturalLandmark culturalLandmark) {
        return ResponseEntity.ok(culturalLandmarkService.addCulturalLandmark(culturalLandmark));
    }

    @DeleteMapping("/cultural-landmarks/{id}")
    public ResponseEntity<Void> deleteCulturalLandmark(@PathVariable Long id) {
        culturalLandmarkService.deleteCulturalLandmark(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cultural-landmarks")
    public ResponseEntity<List<CulturalLandmark>> getAllCulturalLandmarks() {
        List<CulturalLandmark> landmarks = culturalLandmarkService.getAllCulturalLandmarks();
        return ResponseEntity.ok(landmarks);
    }

    @GetMapping("/{id}/cultural-landmarks")
    public ResponseEntity<List<CulturalLandmark>> getCulturalLandmarkByCityAdminId(@PathVariable Long id) {
        CityAdmin cityAdmin = cityAdminService.getCityAdminById(id);
        if (cityAdmin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(null);
        }
        List<CulturalLandmark> landmarks = culturalLandmarkService.getCulturalLandmarksByCity(cityAdmin.getCity());
        return ResponseEntity.ok(landmarks);
    }
}
