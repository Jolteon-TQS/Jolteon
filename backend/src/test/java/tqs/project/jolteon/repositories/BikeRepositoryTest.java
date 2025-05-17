package tqs.project.jolteon.repositories;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import tqs.project.jolteon.entities.Bike;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class BikeRepositoryTest {

    @Autowired
    private BikeRepository bikeRepository;

    @BeforeEach
    void setUp() {
        bikeRepository.deleteAll();
    }

    @Test
    void whenFindBikeById_thenReturnBike() {
        Bike bike = new Bike();
        bike.setBattery(80);
        bike.setIsAvailable(true);
        bike.setLatitude(40.0f);
        bike.setLongitude(-8.0f);

        bikeRepository.save(bike);

        Bike foundBike = bikeRepository.findById(bike.getId()).orElse(null);
        assertThat(foundBike).isNotNull();
        assertThat(foundBike.getBattery()).isEqualTo(80);
    }

    @Test
    void whenInvalidBikeId_thenReturnNull() {
        Bike foundBike = bikeRepository.findById(999L).orElse(null);
        assertThat(foundBike).isNull();
    }

    @Test
    void givenBikesSaved_whenFindAllBikes_thenBikesAreFound() {
        Bike bike1 = new Bike();
        bike1.setBattery(80);
        bike1.setIsAvailable(true);
        bike1.setLatitude(40.0f);
        bike1.setLongitude(-8.0f);

        Bike bike2 = new Bike();
        bike2.setBattery(60);
        bike2.setIsAvailable(false);
        bike2.setLatitude(41.0f);
        bike2.setLongitude(-9.0f);

        bikeRepository.save(bike1);
        bikeRepository.save(bike2);

        List<Bike> result = bikeRepository.findAll();
        assertThat(result).hasSize(2);
    }

    @Test
    void givenNoBikesSaved_whenFindAllBikes_thenNoBikesAreFound() {
        List<Bike> result = bikeRepository.findAll();
        assertThat(result).isEmpty();
    }

    @Test
    void givenSavedBikes_whenFindAvailableBikesNearLocaion_thenAvailableAndWithinRangeBikesAreFound() {

        // Available bike within range (should be found)
        Bike bike1 = new Bike();
        bike1.setBattery(80);
        bike1.setIsAvailable(true);
        bike1.setLatitude(40.0f);
        bike1.setLongitude(-8.0f);

        // Unavailable bike within range (should not be found)
        Bike bike2 = new Bike();
        bike2.setBattery(60);
        bike2.setIsAvailable(false);
        bike2.setLatitude(40.1f);
        bike2.setLongitude(-8.1f);

        // Available bike out of range (should not be found)
        Bike bike3 = new Bike();
        bike3.setBattery(70);
        bike3.setIsAvailable(true);
        bike3.setLatitude(41.0f);
        bike3.setLongitude(-9.0f);

        bikeRepository.save(bike1);
        bikeRepository.save(bike2);
        bikeRepository.save(bike3);

        List<Bike> result = bikeRepository.findAvailableBikesNearLocation(40.0f, -8.0f);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getBattery()).isEqualTo(80);
    }
}
