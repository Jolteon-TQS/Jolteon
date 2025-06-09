package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.Bike;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, Long> {

    // Custom query to find available bikes near a given location, within a radius of, roughly, 1.11km, using the Euclidean formula
    // @Query("SELECT b FROM Bike b WHERE b.isAvailable = true AND " +
    //        "SQRT(POWER(b.latitude - :latitude, 2) + POWER(b.longitude - :longitude, 2)) < 0.01")

    // Custom query to find available bikes near a given location, within a radius of 1km, using the Haversine formula
    // This formula calculates the distance between two points on the surface of a sphere (Earth) given their latitude and longitude
    // The formula is: a = sin²(Δφ/2) + cos φ₁ * cos φ₂ * sin²(Δλ/2)
    @Query("SELECT b FROM Bike b WHERE b.isAvailable = true AND " +
    "(6371 * ACOS(COS(RADIANS(:latitude)) * COS(RADIANS(b.latitude)) * " +
    "COS(RADIANS(b.longitude) - RADIANS(:longitude)) + SIN(RADIANS(:latitude)) * SIN(RADIANS(b.latitude)))) < 1")
    List<Bike> findAvailableBikesNearLocation(@Param("latitude") float latitude, @Param("longitude") float longitude);


    List<Bike> findByCity(String city);

    // Custom query to find bikes by charging spot ID
    @Query("SELECT b FROM Bike b WHERE b.chargingSpot.id = :chargingSpotId")
    List<Bike> findByChargingSpotId(@Param("chargingSpotId") Long chargingSpotId);
}
