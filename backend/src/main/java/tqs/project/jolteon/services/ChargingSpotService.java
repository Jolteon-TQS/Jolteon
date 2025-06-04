package tqs.project.jolteon.services;

import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.ChargingSpotRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import tqs.project.jolteon.entities.Bike;


@Service
public class ChargingSpotService {

    private final ChargingSpotRepository chargingSpotRepository;

    public ChargingSpotService(ChargingSpotRepository chargingSpotRepository) {
        this.chargingSpotRepository = chargingSpotRepository;
    }

    public ChargingSpot addChargingSpot(ChargingSpot chargingSpot) {
        return chargingSpotRepository.save(chargingSpot);
    }


    public Set<Bike> getAvailableBikes(Long id) {
        return chargingSpotRepository.findById(id)
                .map(ChargingSpot::getBikes)
                .map(bikes -> bikes.stream()
                        .filter(bike -> Boolean.TRUE.equals(bike.getIsAvailable()))
                        .collect(Collectors.toSet()))
                .orElseThrow(() -> new RuntimeException("Charging spot not found with id " + id));
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

    public ChargingSpot findNearestOrRandom(String city) {
        // first we try to find one of the same city, 
        List<ChargingSpot> spots = chargingSpotRepository.findByCity(city);
        if (!spots.isEmpty()) {
            // if there are multiple, we can return a random one
            int randomIndex = (int) (Math.random() * spots.size());
            return spots.get(randomIndex);
        } else {
            // if there are no spots in the city, we can return a random one from all available
            List<ChargingSpot> allSpots = chargingSpotRepository.findAll();
            if (!allSpots.isEmpty()) {
                int randomIndex = (int) (Math.random() * allSpots.size());
                return allSpots.get(randomIndex);
            } else {
                throw new RuntimeException("No charging spots available");
            }
        }
    }

}
