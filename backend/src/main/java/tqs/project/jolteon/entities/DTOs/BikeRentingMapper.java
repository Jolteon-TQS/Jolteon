package tqs.project.jolteon.entities.DTOs;

import tqs.project.jolteon.entities.BikeRenting;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.ChargingSpot;

import java.util.Set;
import java.util.stream.Collectors;

public class BikeRentingMapper {

    public static BikeRentingDTO toDTO(BikeRenting entity) {
        Set<CulturalLandmarkDTO> landmarkDTOs = null;
        if (entity.getCulturalLandmarks() != null) {
            landmarkDTOs = entity.getCulturalLandmarks().stream()
                .map(CulturalLandmarkMapper::toDTO)
                .collect(Collectors.toSet());
        }

    return new BikeRentingDTO(
        entity.getId(),
        BikeMapper.toDTO(entity.getBike()),
        UserMapper.toDTO(entity.getUser()),
        landmarkDTOs,
        entity.getStartSpot() != null ? ChargingSpotMapper.toDTO(entity.getStartSpot()) : null,
        entity.getEndSpot() != null ? ChargingSpotMapper.toDTO(entity.getEndSpot()) : null,
        entity.getTime(),
        entity.getEndTime()
    );

    }

    public static BikeRenting toEntity(BikeRentingDTO dto, Bike bike, NormalUser user,
                                      Set<CulturalLandmark> culturalLandmarks,
                                      ChargingSpot startSpot, ChargingSpot endSpot) {
        BikeRenting entity = new BikeRenting();
        entity.setId(dto.getId());
        entity.setBike(bike);
        entity.setUser(user);
        entity.setCulturalLandmarks(culturalLandmarks);
        entity.setStartSpot(startSpot);
        entity.setEndSpot(endSpot);
        entity.setTime(dto.getTime());
        entity.setEndTime(dto.getEndTime());
        return entity;
    }
}
