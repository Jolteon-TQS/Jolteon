package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
    void testGetChargingSpotByIdFound() {
        ChargingSpot spot = new ChargingSpot();
        when(chargingSpotRepository.findById(1L)).thenReturn(Optional.of(spot));

        ChargingSpot result = chargingSpotService.getChargingSpotById(1L);

        assertEquals(spot, result);
        verify(chargingSpotRepository, times(1)).findById(1L);
    }

    @Test
    void testGetChargingSpotByIdNotFound() {
        when(chargingSpotRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            chargingSpotService.getChargingSpotById(1L);
        });
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
        when(chargingSpotRepository.findAll()).thenReturn(Arrays.asList(spot1, spot2));

        List<ChargingSpot> result = chargingSpotService.getAllChargingSpots();

        assertEquals(2, result.size());
        assertTrue(result.contains(spot1));
        assertTrue(result.contains(spot2));
        verify(chargingSpotRepository, times(1)).findAll();
    }

    @Test
    void testUpdateChargingSpotFound() {
        ChargingSpot existingSpot = new ChargingSpot();
        existingSpot.setId(1L);
        existingSpot.setCity("Old City");
        
        ChargingSpot updatedSpot = new ChargingSpot();
        updatedSpot.setCity("New City");
        updatedSpot.setLatitude((float)40.0);
        updatedSpot.setLongitude((float)-8.0);
        updatedSpot.setCapacity(10);

        when(chargingSpotRepository.findById(1L)).thenReturn(Optional.of(existingSpot));
        when(chargingSpotRepository.save(existingSpot)).thenReturn(existingSpot);

        ChargingSpot result = chargingSpotService.updateChargingSpot(1L, updatedSpot);

        assertEquals("New City", result.getCity());
        assertEquals(40.0, result.getLatitude());
        assertEquals(-8.0, result.getLongitude());
        assertEquals(10, result.getCapacity());
        verify(chargingSpotRepository, times(1)).findById(1L);
        verify(chargingSpotRepository, times(1)).save(existingSpot);
    }

    @Test
    void testUpdateChargingSpotNotFound() {
        ChargingSpot updatedSpot = new ChargingSpot();
        when(chargingSpotRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            chargingSpotService.updateChargingSpot(1L, updatedSpot);
        });
    }

    @Test
    void testGetChargingSpotsByCity() {
        ChargingSpot spot1 = new ChargingSpot();
        spot1.setCity("Porto");
        ChargingSpot spot2 = new ChargingSpot();
        spot2.setCity("Porto");
        
        when(chargingSpotRepository.findByCity("Porto")).thenReturn(Arrays.asList(spot1, spot2));

        List<ChargingSpot> result = chargingSpotService.getChargingSpotsByCity("Porto");

        assertEquals(2, result.size());
        assertTrue(result.contains(spot1));
        assertTrue(result.contains(spot2));
        verify(chargingSpotRepository, times(1)).findByCity("Porto");
    }

    @Test
    void testGetChargingSpotsByCityNotFound() {
        when(chargingSpotRepository.findByCity("Lisbon")).thenReturn(Arrays.asList());

        List<ChargingSpot> result = chargingSpotService.getChargingSpotsByCity("Lisbon");

        assertTrue(result.isEmpty());
        verify(chargingSpotRepository, times(1)).findByCity("Lisbon");
    }
}