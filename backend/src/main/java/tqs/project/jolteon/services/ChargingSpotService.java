package tqs.project.jolteon.services;

import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.ChargingSpotRepository;
import java.util.List;
import org.springframework.stereotype.Service;


@Service
public class ChargingSpotService {

    private final ChargingSpotRepository chargingSpotRepository;

    public ChargingSpotService(ChargingSpotRepository chargingSpotRepository) {
        this.chargingSpotRepository = chargingSpotRepository;
    }

    public ChargingSpot addChargingSpot(ChargingSpot chargingSpot) {
        return chargingSpotRepository.save(chargingSpot);
    }

    public <Optional> ChargingSpot getChargingSpotById(Long id) {
        return chargingSpotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Charging spot not found"));
    }

    public void deleteChargingSpot(Long id) {
        chargingSpotRepository.deleteById(id);
    }

    public List<ChargingSpot> getAllChargingSpots() {
        return chargingSpotRepository.findAll();
    }

    public ChargingSpot updateChargingSpot(Long id, ChargingSpot updatedChargingSpot) {
        return chargingSpotRepository.findById(id)
                .map(chargingSpot -> {
                    chargingSpot.setCity(updatedChargingSpot.getCity());
                    chargingSpot.setLatitude(updatedChargingSpot.getLatitude());
                    chargingSpot.setLongitude(updatedChargingSpot.getLongitude());
                    chargingSpot.setCapacity(updatedChargingSpot.getCapacity());
                    return chargingSpotRepository.save(chargingSpot);
                })
                .orElseThrow(() -> new RuntimeException("Charging spot not found with id " + id));
    }

    public List<ChargingSpot> getChargingSpotsByCity(String city) {
        return chargingSpotRepository.findByCity(city);
    }

}
