package tqs.project.jolteon.services;

import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.repositories.CulturalLandmarkRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CulturalLandmarkServiceTest {

    private CulturalLandmarkRepository culturalLandmarkRepository;
    private CulturalLandmarkService culturalLandmarkService;

    @BeforeEach
    void setUp() {
        culturalLandmarkRepository = Mockito.mock(CulturalLandmarkRepository.class);
        culturalLandmarkService = new CulturalLandmarkService(culturalLandmarkRepository);
    }

    @Test
    void testAddCulturalLandmark() {
        CulturalLandmark landmark = new CulturalLandmark();
        when(culturalLandmarkRepository.save(landmark)).thenReturn(landmark);
        CulturalLandmark result = culturalLandmarkService.addCulturalLandmark(landmark);
        assertEquals(landmark, result);
        verify(culturalLandmarkRepository, times(1)).save(landmark);
    }

    @Test
    void testDeleteCulturalLandmark() {
        Long id = 1L;
        culturalLandmarkService.deleteCulturalLandmark(id);
        verify(culturalLandmarkRepository, times(1)).deleteById(id);
    }

    @Test
    void testGetAllCulturalLandmarks() {
        List<CulturalLandmark> landmarks = Arrays.asList(new CulturalLandmark(), new CulturalLandmark());
        when(culturalLandmarkRepository.findAll()).thenReturn(landmarks);
        List<CulturalLandmark> result = culturalLandmarkService.getAllCulturalLandmarks();
        assertEquals(2, result.size());
        verify(culturalLandmarkRepository, times(1)).findAll();
    }

    @Test
    void testGetCulturalLandmarkByIdFound() {
        CulturalLandmark landmark = new CulturalLandmark();
        landmark.setId(1L);
        when(culturalLandmarkRepository.findById(1L)).thenReturn(Optional.of(landmark));
        CulturalLandmark result = culturalLandmarkService.getCulturalLandmarkById(1L);
        assertEquals(landmark, result);
        verify(culturalLandmarkRepository, times(1)).findById(1L);
    }

    @Test
    void testGetCulturalLandmarkByIdNotFound() {
        when(culturalLandmarkRepository.findById(999L)).thenReturn(Optional.empty());
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            culturalLandmarkService.getCulturalLandmarkById(999L);
        });
        assertTrue(exception.getMessage().contains("Cultural landmark not found"));
        verify(culturalLandmarkRepository, times(1)).findById(999L);
    }

    @Test
    void testGetCulturalLandmarksByCity() {
        List<CulturalLandmark> landmarks = Arrays.asList(new CulturalLandmark(), new CulturalLandmark());
        when(culturalLandmarkRepository.findByCity("Lisbon")).thenReturn(landmarks);
        List<CulturalLandmark> result = culturalLandmarkService.getCulturalLandmarksByCity("Lisbon");
        assertEquals(2, result.size());
        verify(culturalLandmarkRepository, times(1)).findByCity("Lisbon");
    }

    @Test
    void testUpdateCulturalLandmarkWhenExists() {
        CulturalLandmark landmark = new CulturalLandmark();
        landmark.setId(1L);
        when(culturalLandmarkRepository.existsById(1L)).thenReturn(true);
        when(culturalLandmarkRepository.save(landmark)).thenReturn(landmark);
        CulturalLandmark result = culturalLandmarkService.updateCulturalLandmark(landmark);
        assertEquals(landmark, result);
        verify(culturalLandmarkRepository, times(1)).existsById(1L);
        verify(culturalLandmarkRepository, times(1)).save(landmark);
    }

    @Test
    void testUpdateCulturalLandmarkWhenNotExists() {
        CulturalLandmark landmark = new CulturalLandmark();
        landmark.setId(999L);
        when(culturalLandmarkRepository.existsById(999L)).thenReturn(false);
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            culturalLandmarkService.updateCulturalLandmark(landmark);
        });
        assertTrue(exception.getMessage().contains("Cultural landmark not found"));
        verify(culturalLandmarkRepository, times(1)).existsById(999L);
        verify(culturalLandmarkRepository, never()).save(landmark);
    }



    @Test
    void testGetCulturalLandmarksByIds() {
        List<CulturalLandmark> landmarks = Arrays.asList(new CulturalLandmark(), new CulturalLandmark());
        when(culturalLandmarkRepository.findAllByIdIn(Set.of(1L, 2L))).thenReturn(Set.copyOf(landmarks));
        Set<CulturalLandmark> result = culturalLandmarkService.getCulturalLandmarksByIds(Set.of(1L, 2L));
        assertEquals(2, result.size());
        verify(culturalLandmarkRepository, times(1)).findAllByIdIn(Set.of(1L, 2L));
    }

}
