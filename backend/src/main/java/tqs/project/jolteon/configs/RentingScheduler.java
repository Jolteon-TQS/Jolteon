package tqs.project.jolteon.configs;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

import java.util.List;
import tqs.project.jolteon.entities.BikeRenting;
import tqs.project.jolteon.repositories.BikeRentingRepository;
import lombok.RequiredArgsConstructor;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.services.BikeService;
import tqs.project.jolteon.services.ChargingSpotService;
import tqs.project.jolteon.entities.Bike;

@Component
@RequiredArgsConstructor
public class RentingScheduler {

    private final BikeRentingRepository bikeRentingRepository;
    private final ChargingSpotService chargingSpotService;
    private final BikeService bikeService;

    @Scheduled(fixedRate = 60000) 
    public void autoEndRentings() {
        LocalDateTime now = LocalDateTime.now();

        List<BikeRenting> expiredRentings = bikeRentingRepository
            .findAllByEndTimeBeforeAndEndSpotIsNullAndBike_IsAvailableFalse(now);


        for (BikeRenting renting : expiredRentings) {
            String city = renting.getStartSpot().getCity();
            ChargingSpot assignedSpot = chargingSpotService.findNearestOrRandom(city); 
            renting.setEndSpot(assignedSpot);
            renting.setEndTime(now); 
            renting.getBike().setIsAvailable(true);
            renting.getBike().setChargingSpot(assignedSpot);
            Bike bike = renting.getBike();
            Long bikeId = bike.getId();
            bikeService.updateBike(bikeId, bike);
            bikeRentingRepository.save(renting);
        }

    }
}


