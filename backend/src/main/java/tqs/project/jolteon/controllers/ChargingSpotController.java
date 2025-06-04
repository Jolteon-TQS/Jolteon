package tqs.project.jolteon.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestBody;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.ChargingSpotRepository;
import tqs.project.jolteon.services.ChargingSpotService;
import java.util.List;


@RestController
@RequestMapping("/api/stations")
public class ChargingSpotController {
    
    private final ChargingSpotService chargingSpotService;
    private final ChargingSpotRepository chargingSpotRepository;

    public ChargingSpotController(ChargingSpotService chargingSpotService, ChargingSpotRepository chargingSpotRepository) {
        this.chargingSpotService = chargingSpotService;
        this.chargingSpotRepository = chargingSpotRepository;
    }

    @GetMapping
    public List<ChargingSpot> getAllChargingSpots() {
        return chargingSpotService.getAllChargingSpots();
    }

    @GetMapping("/search")
    public List<ChargingSpot> searchChargingSpots(@RequestParam String city) {
        return chargingSpotService.getAllChargingSpots()
                .stream()
                .filter(spot -> spot.getCity().equalsIgnoreCase(city))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChargingSpot> getChargingSpotById(@PathVariable Long id) {
        if (!chargingSpotRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ChargingSpot spot = chargingSpotService.getChargingSpotById(id);
        return ResponseEntity.ok(spot);
    }

    @PostMapping
    public ResponseEntity<ChargingSpot> createStation(@RequestBody ChargingSpot chargingSpot) {
        if (chargingSpot.getCity() == null || chargingSpot.getLatitude() == 0 || chargingSpot.getLongitude() == 0) {
            return ResponseEntity.badRequest().build();
        }
        ChargingSpot createdChargingSpot = chargingSpotService.addChargingSpot(chargingSpot);
        return ResponseEntity.ok(createdChargingSpot);
    }

    @PutMapping("/{id}")   
    public ResponseEntity<ChargingSpot> updateChargingSpot(@PathVariable Long id, @RequestBody ChargingSpot chargingSpot) {
        try {
            if (!chargingSpotRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            chargingSpotService.updateChargingSpot(id, chargingSpot);
            ChargingSpot updatedSpot = chargingSpotService.getChargingSpotById(id);
            return ResponseEntity.ok(updatedSpot);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChargingSpot(@PathVariable Long id) {
        if (!chargingSpotRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        chargingSpotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
