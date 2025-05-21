package tqs.project.jolteon.controllers;

import org.springframework.web.bind.annotation.*;

import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.services.OperatorService;

import java.util.List;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/operators")
public class OperatorController {

    private final OperatorService operatorService;
    public OperatorController(OperatorService operatorService) {
        this.operatorService = operatorService;
    }
    
    @PostMapping("/createBike")
    public ResponseEntity<Bike> createBike(@RequestBody Bike bike) {
        return ResponseEntity.ok(operatorService.createBike(bike));
    }

    @DeleteMapping("/deleteBike")
    public ResponseEntity<Void> deleteBike(@RequestBody Long id) {
        operatorService.deleteBike(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/createChargingSpot")
    public ResponseEntity<ChargingSpot> createChargingSpot(@RequestBody ChargingSpot chargingSpot) {
        return ResponseEntity.ok(operatorService.createChargingSpot(chargingSpot));
    }

    @DeleteMapping("/deleteChargingSpot")
    public ResponseEntity<Void> deleteChargingSpot(@RequestBody Long id) {
        operatorService.deleteChargingSpot(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/bikeStatus")
    public  ResponseEntity<Bike> getBikeStatus(@PathVariable Long id) {
        return operatorService.getBikeStatus(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/bikesInCity")
    public ResponseEntity<List<Bike>> getBikesInOperatorCity(@RequestParam Long operatorId) {
        return ResponseEntity.ok(operatorService.getBikesInOperatorCity(operatorId));
    }

    

    
}
