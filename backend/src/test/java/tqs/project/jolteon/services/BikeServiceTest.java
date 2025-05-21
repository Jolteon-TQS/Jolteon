package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.repositories.BikeRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class BikeServiceTest {

    @Mock
    private BikeRepository bikeRepository;

    @InjectMocks
    private BikeService bikeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void whenGetAllBikesIsCalled_thenAllBikesShouldBeReturned() {
        Bike bike1 = new Bike();
        Bike bike2 = new Bike();
        when(bikeRepository.findAll()).thenReturn(Arrays.asList(bike1, bike2));

        List<Bike> bikes = bikeService.getAllBikes();

        assertEquals(2, bikes.size());
        verify(bikeRepository, times(1)).findAll();
    }

    @Test
    void whenGetBikeByIdIsCalled_thenCorrectBikeShouldBeReturned() {
        Bike bike = new Bike();
        bike.setId(1L);
        when(bikeRepository.findById(1L)).thenReturn(Optional.of(bike));

        Optional<Bike> result = bikeService.getBikeById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(bikeRepository, times(1)).findById(1L);
    }

    @Test
    void whenGetAvailableBikesNearLocationIsCalled_thenOnlyAvailableBikesWithinRangeShouldBeReturned() {
        float centerLatitude = 40.0f;
        float centerLongitude = -8.0f;

        Bike bike1 = new Bike();
        bike1.setIsAvailable(true);
        bike1.setLatitude(40.0);
        bike1.setLongitude(-8.0);

        Bike bike2 = new Bike();
        bike2.setIsAvailable(true);
        bike2.setLatitude(55.0);
        bike2.setLongitude(-15.0);

        Bike bike3 = new Bike();
        bike3.setIsAvailable(false);
        bike3.setLatitude(40.1);
        bike3.setLongitude(-8.1);

        when(bikeRepository.findAvailableBikesNearLocation(centerLatitude, centerLongitude))
                .thenReturn(Arrays.asList(bike1));
        List<Bike> availableBikes = bikeService.getAvailableBikesNearLocation(centerLatitude, centerLongitude);

        assertEquals(1, availableBikes.size());
        assertTrue(availableBikes.get(0).getIsAvailable());
        verify(bikeRepository, times(1)).findAvailableBikesNearLocation(centerLatitude, centerLongitude);
    }

    @Test
    void whenSaveBikeIsCalled_thenBikeShouldBeSaved() {
        Bike bike = new Bike();
        bike.setCity("Porto");
        when(bikeRepository.save(bike)).thenReturn(bike);

        Bike saved = bikeService.saveBike(bike);

        assertNotNull(saved);
        assertEquals("Porto", saved.getCity());
        verify(bikeRepository, times(1)).save(bike);
    }

    @Test
    void whenDeleteBikeIsCalled_thenBikeShouldBeDeleted() {
        Long bikeId = 1L;

        doNothing().when(bikeRepository).deleteById(bikeId);

        bikeService.deleteBike(bikeId);

        verify(bikeRepository, times(1)).deleteById(bikeId);
    }

    @Test
    void whenUpdateBikeIsCalledWithValidData_thenBikeShouldBeUpdated() {
        Long bikeId = 1L;
        Bike existingBike = new Bike();
        existingBike.setId(bikeId);

        Bike updatedBike = new Bike();
        updatedBike.setBattery(90.0f);
        updatedBike.setAutonomy(20);
        updatedBike.setIsAvailable(true);
        updatedBike.setLatitude(40.0);
        updatedBike.setLongitude(-8.0);
        updatedBike.setCity("Aveiro");

        when(bikeRepository.findById(bikeId)).thenReturn(Optional.of(existingBike));
        when(bikeRepository.save(any(Bike.class))).thenReturn(updatedBike);

        Bike resultingBike = bikeService.updateBike(bikeId, updatedBike);

        assertEquals(90, resultingBike.getBattery());
        assertEquals(20, resultingBike.getAutonomy());
        assertTrue(resultingBike.getIsAvailable());
        assertEquals("Aveiro", resultingBike.getCity());
        verify(bikeRepository, times(1)).findById(bikeId);
        verify(bikeRepository, times(1)).save(existingBike);
    }

    @Test
    void whenUpdateBikeIsCalledWithInvalidBattery_thenExceptionShouldBeThrown() {
        Bike updatedBike = new Bike();
        updatedBike.setBattery(-15.0f); // Invalid

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bikeService.updateBike(1L, updatedBike);
        });

        assertEquals("Battery must be between 0 and 100", exception.getMessage());
    }

    @Test
    void whenUpdateBikeIsCalledWithInvalidAutonomy_thenExceptionShouldBeThrown() {
        Bike updatedBike = new Bike();
        updatedBike.setBattery(80.0f);
        updatedBike.setAutonomy(0); // Invalid

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bikeService.updateBike(1L, updatedBike);
        });

        assertEquals("Autonomy must be greater than 0", exception.getMessage());
    }
}
