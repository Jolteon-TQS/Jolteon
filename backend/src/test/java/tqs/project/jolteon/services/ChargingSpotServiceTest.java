package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.ChargingSpotRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ChargingSpotServiceTest {

    private ChargingSpotRepository chargingSpotRepository;
    private ChargingSpotService chargingSpotService;

    @BeforeEach
    void setUp() {
        chargingSpotRepository = mock(ChargingSpotRepository.class);
        chargingSpotService = new ChargingSpotService(chargingSpotRepository);
    }

    @Test
    void testAddChargingSpot() {
        ChargingSpot spot = new ChargingSpot();
        when(chargingSpotRepository.save(spot)).thenReturn(spot);

        ChargingSpot result = chargingSpotService.addChargingSpot(spot);

        assertEquals(spot, result);
        verify(chargingSpotRepository, times(1)).save(spot);
    }

    @Test
    void testGetChargingSpotById() {
        Long id = 1L;
        ChargingSpot spot = new ChargingSpot();
        when(chargingSpotRepository.findById(id)).thenReturn(Optional.of(spot));

        ChargingSpot result = chargingSpotService.getChargingSpotById(id);

        assertEquals(spot, result);
        verify(chargingSpotRepository, times(1)).findById(id);
    }

    @Test
    void testDeleteChargingSpot() {
        Long id = 1L;

        chargingSpotService.deleteChargingSpot(id);

        verify(chargingSpotRepository, times(1)).deleteById(id);
    }

    @Test
    void testGetAllChargingSpots() {
        ChargingSpot spot1 = new ChargingSpot();
        ChargingSpot spot2 = new ChargingSpot();
        List<ChargingSpot> spots = Arrays.asList(spot1, spot2);

        when(chargingSpotRepository.findAll()).thenReturn(spots);

        List<ChargingSpot> result = chargingSpotService.getAllChargingSpots();

        assertEquals(2, result.size());
        assertTrue(result.contains(spot1));
        assertTrue(result.contains(spot2));
        verify(chargingSpotRepository, times(1)).findAll();
    }
}
