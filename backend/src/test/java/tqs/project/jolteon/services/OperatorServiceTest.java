package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.entities.Operator;
import tqs.project.jolteon.repositories.OperatorRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class OperatorServiceTest {

    private OperatorRepository operatorRepository;
    private BikeService bikeService;
    private ChargingSpotService chargingSpotService;
    private OperatorService operatorService;

    @BeforeEach
    void setUp() {
        operatorRepository = mock(OperatorRepository.class);
        bikeService = mock(BikeService.class);
        chargingSpotService = mock(ChargingSpotService.class);
        operatorService = new OperatorService(operatorRepository, bikeService, chargingSpotService);
    }

    @Test
    void testCreateBike() {
        Bike bike = new Bike();
        when(bikeService.saveBike(bike)).thenReturn(bike);
        Bike result = operatorService.createBike(bike);
        assertEquals(bike, result);
        verify(bikeService, times(1)).saveBike(bike);
    }

    @Test
    void testDeleteBike() {
        Long id = 1L;
        operatorService.deleteBike(id);
        verify(bikeService, times(1)).deleteBike(id);
    }

    @Test
    void testCreateChargingSpot() {
        ChargingSpot spot = new ChargingSpot();
        when(chargingSpotService.addChargingSpot(spot)).thenReturn(spot);
        ChargingSpot result = operatorService.createChargingSpot(spot);
        assertEquals(spot, result);
        verify(chargingSpotService, times(1)).addChargingSpot(spot);
    }

    @Test
    void testDeleteChargingSpot() {
        Long id = 1L;
        operatorService.deleteChargingSpot(id);
        verify(chargingSpotService, times(1)).deleteChargingSpot(id);
    }

    @Test
    void testGetBikeStatusFound() {
        Bike bike = new Bike();
        when(bikeService.getBikeById(1L)).thenReturn(Optional.of(bike));
        Optional<Bike> result = operatorService.getBikeStatus(1L);
        assertTrue(result.isPresent());
        assertEquals(bike, result.get());
    }

    @Test
    void testGetBikeStatusNotFound() {
        when(bikeService.getBikeById(1L)).thenReturn(Optional.empty());
        Optional<Bike> result = operatorService.getBikeStatus(1L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetBikesInOperatorCity() {
        Operator operator = new Operator();
        operator.setCity("Porto");
        Bike bike1 = new Bike();
        Bike bike2 = new Bike();
        when(operatorRepository.findById(1L)).thenReturn(Optional.of(operator));
        when(bikeService.getBikesByCity("Porto")).thenReturn(Arrays.asList(bike1, bike2));
        List<Bike> result = operatorService.getBikesInOperatorCity(1L);
        assertEquals(2, result.size());
        assertTrue(result.contains(bike1));
        assertTrue(result.contains(bike2));
    }

    @Test
    void testGetBikesInOperatorCityThrowsException() {
        when(operatorRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> operatorService.getBikesInOperatorCity(1L));
    }

    @Test
    void testGetAllChargingSpots() {
        ChargingSpot spot = new ChargingSpot();
        when(chargingSpotService.getAllChargingSpots()).thenReturn(List.of(spot));
        List<ChargingSpot> result = operatorService.getAllChargingSpots();
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllBikes() {
        Bike bike = new Bike();
        when(bikeService.getAllBikes()).thenReturn(List.of(bike));
        List<Bike> result = operatorService.getAllBikes();
        assertEquals(1, result.size());
    }
}
