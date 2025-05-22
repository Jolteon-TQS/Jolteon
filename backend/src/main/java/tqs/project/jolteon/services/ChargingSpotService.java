package tqs.project.jolteon.services;

import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.BikeRepository;
import tqs.project.jolteon.repositories.ChargingSpotRepository;
import java.util.List;
import org.springframework.stereotype.Service;


@Service
public class ChargingSpotService {

    private final ChargingSpotRepository chargingSpotRepository;
    private final BikeRepository bikeRepository;

    public ChargingSpotService(ChargingSpotRepository chargingSpotRepository, BikeRepository bikeRepository) {
        this.chargingSpotRepository = chargingSpotRepository;
        this.bikeRepository = bikeRepository;
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

    public void addBikeToChargingSpot(Long chargingSpotId, Long bikeId) {
    // Busca o ChargingSpot
    ChargingSpot chargingSpot = chargingSpotRepository.findById(chargingSpotId)
            .orElseThrow(() -> new RuntimeException("Charging spot not found with ID: " + chargingSpotId));

    // Busca a Bike
    Bike bike = bikeRepository.findById(bikeId)
            .orElseThrow(() -> new RuntimeException("Bike not found with ID: " + bikeId));

    // Verifica se a Bike já está associada a outro ChargingSpot
    if (bike.getCharging_spot() != null && !bike.getCharging_spot().getId().equals(chargingSpotId)) {
        throw new RuntimeException("Bike is already associated with another charging Chargingspot.");
    }

    // Associa a Bike ao ChargingChargingSpot
    bike.setCharging_spot(chargingSpot);
    bikeRepository.save(bike); // importante: salvar a bike após atualizar

    // Adiciona a Bike ao conjunto do ChargingSpot (opcional se usar lado inverso apenas para leitura)
    chargingSpot.getBikes().add(bike);
    chargingSpotRepository.save(chargingSpot); // salvar se quiser persistir mudanças no lado inverso
}


    
}
