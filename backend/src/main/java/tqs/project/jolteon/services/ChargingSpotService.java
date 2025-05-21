package tqs.project.jolteon.services;

import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.ChargingSpotRepository;
import java.util.List;

public class ChargingSpotService {

    private final ChargingSpotRepository chargingSpotRepository;

    public ChargingSpotService(ChargingSpotRepository chargingSpotRepository) {
        this.chargingSpotRepository = chargingSpotRepository;
    }

    public ChargingSpot addChargingSpot(ChargingSpot chargingSpot) {
        return chargingSpotRepository.save(chargingSpot);
    }

    public void deleteChargingSpot(Long id) {
        chargingSpotRepository.deleteById(id);
    }

    public List<ChargingSpot> getAllChargingSpots() {
        return chargingSpotRepository.findAll();
    }

    
}
