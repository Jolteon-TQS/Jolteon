package tqs.project.jolteon.services;

import org.springframework.stereotype.Service;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.repositories.BikeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BikeService {

    private final BikeRepository bikeRepository;

    public BikeService(BikeRepository bikeRepository) {
        this.bikeRepository = bikeRepository;
    }

    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    public Optional<Bike> getBikeById(Long id) {
        return bikeRepository.findById(id);
    }

    //TODO: Check if method is correctly implemented
    public List<Bike> getAvailableBikesNearLocation(float latitude, float longitude) {
        return bikeRepository.findAvailableBikesNearLocation(latitude, longitude);
    }

    public Bike saveBike(Bike bike) {
        return bikeRepository.save(bike);
    }

    public void deleteBike(Long id) {
        bikeRepository.deleteById(id);
    }

    private void validateBike(Bike bike) {
        if (bike.getBattery() < 0 || bike.getBattery() > 100) {
            throw new IllegalArgumentException("Battery must be between 0 and 100");
        }

        if (bike.getAutonomy() <= 0) {
            throw new IllegalArgumentException("Autonomy must be greater than 0");
        }
    }

    public Bike updateBike(Long id, Bike updatedBike) {
        validateBike(updatedBike);
        return bikeRepository.findById(id)
            .map(bike -> {
                bike.setBattery(updatedBike.getBattery());
                bike.setAutonomy(updatedBike.getAutonomy());
                bike.setIsAvailable(updatedBike.getIsAvailable());
                bike.setLatitude(updatedBike.getLatitude());
                bike.setLongitude(updatedBike.getLongitude());
                return bikeRepository.save(bike);
            })
            .orElseThrow(() -> new RuntimeException("Bike not found with id " + id));
    }
}

