package tqs.project.jolteon.entities.DTOs;

import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;

import java.util.Set;
import java.util.stream.Collectors;

public class ChargingSpotMapper {

    public static ChargingSpotDTO toDTO(ChargingSpot chargingSpot) {
        Set<BikeDTO> bikeDTOs = null;
        if (chargingSpot.getBikes() != null) {
            bikeDTOs = chargingSpot.getBikes().stream()
                .map(BikeMapper::toDTO)
                .collect(Collectors.toSet());
        }
        return new ChargingSpotDTO(
            chargingSpot.getId(),
            chargingSpot.getCity(),
            chargingSpot.getLatitude(),
            chargingSpot.getLongitude(),
            bikeDTOs
        );
    }

    public static ChargingSpot toEntity(ChargingSpotDTO dto, Set<Bike> bikes) {
        ChargingSpot chargingSpot = new ChargingSpot();
        chargingSpot.setId(dto.getId());
        chargingSpot.setCity(dto.getCity());
        chargingSpot.setLatitude(dto.getLatitude());
        chargingSpot.setLongitude(dto.getLongitude());
        chargingSpot.setBikes(bikes);
        return chargingSpot;
    }
}
