package tqs.project.jolteon.services;

import tqs.project.jolteon.repositories.OperatorRepository;
import tqs.project.jolteon.entities.Operator;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;

import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;


@Service
public class OperatorService {

    private final OperatorRepository operatorRepository;
    private final BikeService bikeService;
    private final ChargingSpotService chargingSpotService;

    public OperatorService(OperatorRepository operatorRepository, BikeService bikeService, ChargingSpotService chargingSpotService) {
        this.operatorRepository = operatorRepository;
        this.bikeService = bikeService;
        this.chargingSpotService = chargingSpotService;
    }

    public Bike createBike(Bike bike) {
        return bikeService.saveBike(bike);
    }

    public void deleteBike(Long id) {
        bikeService.deleteBike(id);
    }

    public ChargingSpot createChargingSpot(ChargingSpot chargingSpot) {
        return chargingSpotService.addChargingSpot(chargingSpot);
    }

    public void deleteChargingSpot(Long id) {
        chargingSpotService.deleteChargingSpot(id);
    }

    public Optional<Bike> getBikeStatus(Long id) {
        return Optional.ofNullable(bikeService.getBikeById(id).orElse(null));
    }

    public List<Bike> getBikesInOperatorCity(Long operatorId) {
        Operator operator = operatorRepository.findById(operatorId).orElse(null);
        if (operator == null) {
            throw new IllegalArgumentException("Operator not found with id " + operatorId);
        }
        return bikeService.getBikesByCity(operator.getCity());
    }

    //acho q estes n sao necessarios, depois tiram-se
    public List<ChargingSpot> getAllChargingSpots() {
        return chargingSpotService.getAllChargingSpots();
    }

    public List<Bike> getAllBikes() {
        return bikeService.getAllBikes();
    }

    public Operator addOperator(Operator operator) {
        return operatorRepository.save(operator);
    }

    public Operator getOperatorByEmail(String email) {
        return operatorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Operator not found with email: " + email));
    }
   

    
}
