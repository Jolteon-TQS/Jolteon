package tqs.project.jolteon.services;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tqs.project.jolteon.entities.*;
import tqs.project.jolteon.repositories.*;
import java.util.Optional;
import java.util.Set;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BikeRentingService {

    private final BikeRentingRepository bikeRentingRepository;
    private final BikeRepository bikeRepository;
    private final NormalUserRepository userRepository;
    private final ChargingSpotRepository chargingSpotRepository;
    private final CulturalLandmarkRepository culturalLandmarkRepository;

    @Transactional
    public BikeRenting createBikeRenting(Long bikeId,
                                         Long userId,
                                         Long startSpotId,
                                         Long endSpotId,
                                         Set<Long> landmarkIds,
                                         LocalDateTime time,
                                         LocalDateTime endTime) {

        Bike bike = bikeRepository.findById(bikeId)
                .orElseThrow(() -> new IllegalArgumentException("Bike not found"));

        NormalUser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ChargingSpot startSpot = chargingSpotRepository.findById(startSpotId)
                .orElseThrow(() -> new IllegalArgumentException("Start spot not found"));

        ChargingSpot endSpot = null;

        if (endSpotId != null) {
             endSpot = chargingSpotRepository.findById(endSpotId)
                .orElseThrow(() -> new IllegalArgumentException("End spot not found"));
        } 


        Set<CulturalLandmark> landmarks = culturalLandmarkRepository.findAllByIdIn(landmarkIds);

        BikeRenting renting = new BikeRenting();
        renting.setBike(bike);
        renting.setUser(user);
        renting.setStartSpot(startSpot);
        renting.setEndSpot(endSpot);
        renting.setCulturalLandmarks(landmarks);
        renting.setTime(time);
        renting.setEndTime(endTime);

        return bikeRentingRepository.save(renting);
    }


    public Optional<BikeRenting> getById(Long id) {
        return bikeRentingRepository.findById(id);
    }

    public Set<BikeRenting> getAllForUser(Long userId) {
        return bikeRentingRepository.findByUserId(userId);
    }

    public Optional<BikeRenting> getActiveRentingForUser(Long userId) {
        return bikeRentingRepository.findActiveRentingByUserId(userId);
    }

    public List<BikeRenting> getAllRentings() {
        return bikeRentingRepository.findAll();
}

    @Transactional
    public void deleteBikeRenting(Long id) {
        BikeRenting renting = bikeRentingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bike renting not found"));
        bikeRentingRepository.delete(renting);
    }

    @Transactional
    public BikeRenting updateBikeRenting(Long id, BikeRenting updatedRenting) {
        return bikeRentingRepository.findById(id)
                .map(existingRenting -> {
                    existingRenting.setBike(updatedRenting.getBike());
                    existingRenting.setUser(updatedRenting.getUser());
                    existingRenting.setStartSpot(updatedRenting.getStartSpot());
                    existingRenting.setEndSpot(updatedRenting.getEndSpot());
                    existingRenting.setCulturalLandmarks(updatedRenting.getCulturalLandmarks());
                    existingRenting.setTime(updatedRenting.getTime());
                    existingRenting.setEndTime(updatedRenting.getEndTime());
                    return bikeRentingRepository.save(existingRenting);
                })
                .orElseThrow(() -> new IllegalArgumentException("Bike renting not found"));
    }

}
