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
    private final BikeService bikeService;
    private final NormalUserService userService;
    private final ChargingSpotService chargingSpotService;
    private final CulturalLandmarkService culturalLandmarkService;


    @Transactional
    public BikeRenting createBikeRenting(Long bikeId,
                                         Long userId,
                                         Long startSpotId,
                                         Long endSpotId,
                                         Set<Long> landmarkIds,
                                         LocalDateTime time,
                                         LocalDateTime endTime) {

        // If there's alredy an active renting for the user, throw an exception
        if (bikeRentingRepository.findActiveRentingByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("User already has an active bike renting");
        }

        Bike bike = bikeService.getBikeById(bikeId)
                .orElseThrow(() -> new IllegalArgumentException("Bike not found"));

        NormalUser user = userService.getNormalUserById(userId);

        ChargingSpot startSpot = chargingSpotService.getChargingSpotById(startSpotId);

        ChargingSpot endSpot = null;

        if (endSpotId != null) {
             endSpot = chargingSpotService.getChargingSpotById(endSpotId);
        } 

        // make bike unavailable
        if (!bike.getIsAvailable()) {
            throw new IllegalArgumentException("Bike is not available for renting");
        }
        bike.setIsAvailable(false);

        // Remove chargingspot from bike
        if (bike.getChargingSpot() != null) {
            bike.setChargingSpot(null);
        }


        Set<CulturalLandmark> landmarks = culturalLandmarkService.getCulturalLandmarksByIds(landmarkIds);

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


@Transactional
public BikeRenting endBikeRenting(Long id, Long endSpotId) {
    BikeRenting renting = bikeRentingRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Bike renting not found"));

    ChargingSpot endSpot = chargingSpotService.getChargingSpotById(endSpotId);

    // Get number of bikes in the end spot
    List<Bike> bikesInEndSpot = bikeService.getBikesByChargingPointId(endSpotId);

    if (bikesInEndSpot.size() >= endSpot.getCapacity()) {
        throw new IllegalArgumentException("Charging spot is full");
    }

    LocalDateTime endTime = renting.getEndTime();
    renting.setEndTime(endTime != null ? endTime : LocalDateTime.now());
    renting.setEndSpot(endSpot);
    renting.getBike().setIsAvailable(true);
    renting.getBike().setChargingSpot(endSpot);

    return bikeRentingRepository.save(renting);
}


}
