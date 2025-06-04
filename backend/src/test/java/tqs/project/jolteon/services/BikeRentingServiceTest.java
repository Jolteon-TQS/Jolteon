package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tqs.project.jolteon.entities.*;
import tqs.project.jolteon.repositories.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BikeRentingServiceTest {

    @Mock
    private BikeRentingRepository bikeRentingRepository;
    @Mock
    private BikeService bikeService;
    @Mock
    private ChargingSpotService chargingSpotService;
    @Mock
    private NormalUserService userService;
    @Mock
    private CulturalLandmarkService culturalLandmarkService;

    @InjectMocks
    private BikeRentingService bikeRentingService;

    private Bike bike;
    private NormalUser user;
    private ChargingSpot startSpot;
    private ChargingSpot endSpot;
    private CulturalLandmark landmark;
    private Set<CulturalLandmark> landmarks;
    private LocalDateTime time;
    private LocalDateTime endTime;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        bike = new Bike();
        bike.setId(1L);

        user = new NormalUser();
        user.setId(1L);

        startSpot = new ChargingSpot();
        startSpot.setId(1L);

        endSpot = new ChargingSpot();
        endSpot.setId(2L);

        landmark = new CulturalLandmark();
        landmark.setId(1L);
        landmarks = new HashSet<>(Set.of(landmark));

        time = LocalDateTime.now().minusHours(1);
        endTime = LocalDateTime.now();
    }

    @Test
    public void testCreateBikeRenting_Success() {
        bike.setIsAvailable(true);
        bike.setChargingSpot(startSpot);

        when(bikeService.getBikeById(1L)).thenReturn(Optional.of(bike));
        when(userService.getNormalUserById(1L)).thenReturn(user);
        when(chargingSpotService.getChargingSpotById(1L)).thenReturn(startSpot);
        when(chargingSpotService.getChargingSpotById(2L)).thenReturn(endSpot);
        when(culturalLandmarkService.getCulturalLandmarksByIds(Set.of(1L))).thenReturn(landmarks);
        when(bikeRentingRepository.save(any(BikeRenting.class))).thenAnswer(i -> i.getArgument(0));

        BikeRenting result = bikeRentingService.createBikeRenting(
                1L, 1L, 1L, 2L, Set.of(1L), time, endTime);

        assertThat(result.getBike()).isEqualTo(bike);
        assertThat(result.getUser()).isEqualTo(user);
        assertThat(result.getStartSpot()).isEqualTo(startSpot);
        assertThat(result.getEndSpot()).isEqualTo(endSpot);
        assertThat(result.getCulturalLandmarks()).contains(landmark);
        assertThat(result.getTime()).isEqualTo(time);
        assertThat(result.getEndTime()).isEqualTo(endTime);

        assertThat(bike.getIsAvailable()).isFalse();
        assertThat(bike.getChargingSpot()).isNull();
    }

    @Test
    public void testCreateBikeRenting_BikeNotAvailable() {
        bike.setIsAvailable(false);
        when(bikeService.getBikeById(1L)).thenReturn(Optional.of(bike));
        when(userService.getNormalUserById(1L)).thenReturn(user);
        when(chargingSpotService.getChargingSpotById(1L)).thenReturn(startSpot);
        when(chargingSpotService.getChargingSpotById(2L)).thenReturn(endSpot);
        when(culturalLandmarkService.getCulturalLandmarksByIds(Set.of(1L))).thenReturn(landmarks);
        Exception e = assertThrows(IllegalArgumentException.class,
                () -> bikeRentingService.createBikeRenting(1L, 1L, 1L, 2L, Set.of(1L), time, endTime));
        assertEquals("Bike is not available for renting", e.getMessage());

        verify(bikeRentingRepository, never()).save(any(BikeRenting.class));
    }

    @Test
    public void testGetById() {
        BikeRenting renting = new BikeRenting();
        renting.setId(5L);
        when(bikeRentingRepository.findById(5L)).thenReturn(Optional.of(renting));

        Optional<BikeRenting> result = bikeRentingService.getById(5L);

        assertTrue(result.isPresent());
        assertEquals(5L, result.get().getId());
    }

    @Test
    public void testGetAllForUser() {
        Set<BikeRenting> rentings = new HashSet<>();
        rentings.add(new BikeRenting());
        when(bikeRentingRepository.findByUserId(1L)).thenReturn(rentings);

        Set<BikeRenting> result = bikeRentingService.getAllForUser(1L);
        assertEquals(1, result.size());
    }

    @Test
    public void testGetActiveRentingForUser() {
        BikeRenting renting = new BikeRenting();
        when(bikeRentingRepository.findActiveRentingByUserId(1L)).thenReturn(Optional.of(renting));

        Optional<BikeRenting> result = bikeRentingService.getActiveRentingForUser(1L);
        assertTrue(result.isPresent());
    }

    @Test
    public void testGetAllRentings() {
        List<BikeRenting> all = List.of(new BikeRenting(), new BikeRenting());
        when(bikeRentingRepository.findAll()).thenReturn(all);

        List<BikeRenting> result = bikeRentingService.getAllRentings();
        assertEquals(2, result.size());
    }

    @Test
    public void testDeleteBikeRenting() {
        BikeRenting renting = new BikeRenting();
        renting.setId(3L);
        when(bikeRentingRepository.findById(3L)).thenReturn(Optional.of(renting));

        bikeRentingService.deleteBikeRenting(3L);

        verify(bikeRentingRepository).delete(renting);
    }

    @Test
    public void testUpdateBikeRenting_Success() {
        BikeRenting existing = new BikeRenting();
        existing.setId(1L);

        BikeRenting updated = new BikeRenting();
        updated.setBike(bike);
        updated.setUser(user);
        updated.setStartSpot(startSpot);
        updated.setEndSpot(endSpot);
        updated.setCulturalLandmarks(landmarks);
        updated.setTime(time);
        updated.setEndTime(endTime);

        when(bikeRentingRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(bikeRentingRepository.save(any(BikeRenting.class))).thenAnswer(i -> i.getArgument(0));

        BikeRenting result = bikeRentingService.updateBikeRenting(1L, updated);

        assertThat(result.getBike()).isEqualTo(bike);
        assertThat(result.getUser()).isEqualTo(user);
    }

    @Test
    public void testCreateBikeRenting_BikeNotFound() {
        when(bikeService.getBikeById(99L)).thenReturn(Optional.empty());
        Exception e = assertThrows(IllegalArgumentException.class,
                () -> bikeRentingService.createBikeRenting(99L, 1L, 1L, 2L, Set.of(1L), time, endTime));
        assertEquals("Bike not found", e.getMessage());
    }

    @Test
    public void testEndBikeRenting_Success() {
        BikeRenting renting = new BikeRenting();
        renting.setId(1L);
        renting.setBike(bike);
        renting.setEndTime(null);
        renting.setEndSpot(null);

        when(bikeRentingRepository.findById(1L)).thenReturn(Optional.of(renting));
        when(chargingSpotService.getChargingSpotById(2L)).thenReturn(endSpot);
        when(bikeRentingRepository.save(any(BikeRenting.class))).thenAnswer(i -> i.getArgument(0));

        BikeRenting result = bikeRentingService.endBikeRenting(1L, endTime, 2L);

        assertThat(result.getEndTime()).isEqualTo(endTime);
        assertThat(result.getEndSpot()).isEqualTo(endSpot);
        assertThat(result.getBike().getIsAvailable()).isTrue();
    }

}
