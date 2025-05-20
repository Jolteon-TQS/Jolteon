package tqs.project.jolteon.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.services.BikeService;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    private final BikeService bikeService;

    public BikeController(BikeService bikeService) {
        this.bikeService = bikeService;
    }

    @GetMapping
    public ResponseEntity<List<Bike>> getAllBikes() {
        return ResponseEntity.ok(bikeService.getAllBikes());
    }

    //GET api/bikes/search?city=Lisbon
    @GetMapping("/search")
    public ResponseEntity<List<Bike>> searchBikes(@RequestParam String city) {
        List<Bike> bikes = bikeService.getAllBikes();
        List<Bike> filteredBikes = bikes.stream()
                .filter(bike -> bike.getCity().equalsIgnoreCase(city))
                .toList();
        return ResponseEntity.ok(filteredBikes);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Bike> getBikeById(@PathVariable Long id) {
        return bikeService.getBikeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Bike>> getAvailableBikesNearLocation(
            @RequestParam float latitude,
            @RequestParam float longitude) {
        return ResponseEntity.ok(bikeService.getAvailableBikesNearLocation(latitude, longitude));
    }

    @PostMapping
    public ResponseEntity<Bike> createBike(@RequestBody Bike bike) {
        return ResponseEntity.ok(bikeService.saveBike(bike));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Bike> updateBike(@PathVariable Long id, @RequestBody Bike updatedBike) {
        try {
            return ResponseEntity.ok(bikeService.updateBike(id, updatedBike));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBike(@PathVariable Long id) {
        bikeService.deleteBike(id);
        return ResponseEntity.noContent().build();
    }
}

