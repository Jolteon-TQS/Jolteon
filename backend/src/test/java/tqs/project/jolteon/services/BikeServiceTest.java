package tqs.project.jolteon.services;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.repositories.BikeRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BikeServiceTest {

    @Mock
    private BikeRepository bikeRepository;

    @InjectMocks
    private BikeService bikeService;

    private Bike bike;

    @BeforeEach
    public void setUp() {
        bike = new Bike();
        bike.setId(1L);
        bike.setBattery(80);
        bike.setAutonomy(50);
        bike.setIsAvailable(true);
        bike.setLatitude(40.0);
        bike.setLongitude(-8.0);
    }

    @Test
    public void testGetAllBikes() {
        when(bikeRepository.findAll()).thenReturn(Arrays.asList(bike));
        List<Bike> bikes = bikeService.getAllBikes();
        assertEquals(1, bikes.size());
        verify(bikeRepository, times(1)).findAll();
    }

    @Test
    public void testGetBikeById() {
        when(bikeRepository.findById(1L)).thenReturn(Optional.of(bike));
        Optional<Bike> found = bikeService.getBikeById(1L);
        assertTrue(found.isPresent());
        assertEquals(bike.getId(), found.get().getId());
    }

    @Test
    public void testSaveBike() {
        when(bikeRepository.save(bike)).thenReturn(bike);
        Bike saved = bikeService.saveBike(bike);
        assertNotNull(saved);
        assertEquals(bike.getId(), saved.getId());
    }

    @Test
    public void testDeleteBike() {
        doNothing().when(bikeRepository).deleteById(1L);
        bikeService.deleteBike(1L);
        verify(bikeRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testUpdateBikeSuccess() {
        Bike updated = new Bike();
        updated.setBattery(90);
        updated.setAutonomy(60);
        updated.setIsAvailable(false);
        updated.setLatitude(41.0);
        updated.setLongitude(-9.0);

        when(bikeRepository.findById(1L)).thenReturn(Optional.of(bike));
        when(bikeRepository.save(any(Bike.class))).thenReturn(bike);

        Bike result = bikeService.updateBike(1L, updated);

        assertEquals(90, result.getBattery());
        assertEquals(60, result.getAutonomy());
        assertFalse(result.getIsAvailable());
    }

    @Test
    public void testUpdateBikeNotFound() {
        when(bikeRepository.findById(1L)).thenReturn(Optional.empty());

        Bike updated = new Bike();
        updated.setBattery(90);
        updated.setAutonomy(60);
        updated.setIsAvailable(true);
        updated.setLatitude(41.0);
        updated.setLongitude(-9.0);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            bikeService.updateBike(1L, updated);
        });

        assertEquals("Bike not found with id 1", exception.getMessage());
    }

    @Test
    public void testUpdateBikeInvalidBattery() {
        Bike updated = new Bike();
        updated.setBattery(110); // Invalid
        updated.setAutonomy(60);
        updated.setIsAvailable(true);
        updated.setLatitude(41.0);
        updated.setLongitude(-9.0);

        assertThrows(IllegalArgumentException.class, () -> {
            bikeService.updateBike(1L, updated);
        });
    }

    @Test
    public void testUpdateBikeInvalidAutonomy() {
        Bike updated = new Bike();
        updated.setBattery(90);
        updated.setAutonomy(0); // Invalid
        updated.setIsAvailable(true);
        updated.setLatitude(41.0);
        updated.setLongitude(-9.0);

        assertThrows(IllegalArgumentException.class, () -> {
            bikeService.updateBike(1L, updated);
        });
    }
}
