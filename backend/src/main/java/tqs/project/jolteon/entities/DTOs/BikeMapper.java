package tqs.project.jolteon.entities.DTOs;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;

public class BikeMapper {
    public static BikeDTO toDTO(Bike bike) {
        return new BikeDTO(
            bike.getId(),
            bike.getAutonomy(),
            bike.getIsAvailable(),
            bike.getLatitude(),
            bike.getLongitude(),
            bike.getCity(),
            bike.getChargingSpot() != null ? bike.getChargingSpot().getId() : null
        );
    }

    public static Bike toEntity(BikeDTO dto, ChargingSpot chargingSpot) {
        Bike bike = new Bike();
        bike.setId(dto.getId());
        bike.setAutonomy(dto.getAutonomy());
        bike.setIsAvailable(dto.getIsAvailable());
        bike.setLatitude(dto.getLatitude());
        bike.setLongitude(dto.getLongitude());
        bike.setCity(dto.getCity());
        bike.setChargingSpot(chargingSpot); 
        return bike;
    }
}

