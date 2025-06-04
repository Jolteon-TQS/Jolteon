package tqs.project.jolteon.controllers;


import tqs.project.jolteon.entities.Bike;
import java.util.Set;
import java.util.HashSet;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.repositories.ChargingSpotRepository;
import tqs.project.jolteon.services.ChargingSpotService;

@WebMvcTest(ChargingSpotController.class)
class ChargingSpotControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChargingSpotService chargingSpotService;

    @MockBean
    private ChargingSpotRepository chargingSpotRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    private ChargingSpot spot1, spot2;

    @BeforeEach
    void setUp() {
        spot1 = new ChargingSpot();
        spot1.setId(1L);
        spot1.setCity("Porto");
        spot1.setLatitude((float) 41.1579);
        spot1.setLongitude((float) -8.6291);
        spot1.setCapacity(10);

        spot2 = new ChargingSpot();
        spot2.setId(2L);
        spot2.setCity("Lisbon");
        spot2.setLatitude((float) 38.7223);
        spot2.setLongitude((float) -9.1393);
        spot2.setCapacity(8);
    }

    @Test
    void whenGetAllStations_thenReturnAllStations() throws Exception {
        List<ChargingSpot> allStations = Arrays.asList(spot1, spot2);
        when(chargingSpotService.getAllChargingSpots()).thenReturn(allStations);

        mockMvc.perform(get("/api/stations")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].city", is(spot1.getCity())))
                .andExpect(jsonPath("$[1].city", is(spot2.getCity())));

        verify(chargingSpotService, times(1)).getAllChargingSpots();
    }

    @Test
    void whenGetStationById_thenReturnStation() throws Exception {
        ChargingSpot testSpot = new ChargingSpot();
        testSpot.setId(1L);
        testSpot.setCity("Porto");
        testSpot.setLatitude((float) 41.1579); // Cast to float
        testSpot.setLongitude((float) -8.6291);
        testSpot.setCapacity(10);

        when(chargingSpotService.getChargingSpotById(1L)).thenReturn(testSpot);
        when(chargingSpotRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(get("/api/stations/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city", is("Porto")))
                .andExpect(jsonPath("$.latitude", is(41.1579))) 
                .andExpect(jsonPath("$.longitude", is(-8.6291)))
                .andExpect(jsonPath("$.capacity", is(10)));
    }

    @Test
    void whenGetStationByInvalidId_thenReturnNotFound() throws Exception {
        when(chargingSpotRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(get("/api/stations/99")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(chargingSpotService, never()).getChargingSpotById(anyLong());
    }

    @Test
    void whenSearchByCity_thenReturnMatchingStations() throws Exception {
        List<ChargingSpot> portoStations = Arrays.asList(spot1);
        when(chargingSpotService.getAllChargingSpots()).thenReturn(portoStations);

        mockMvc.perform(get("/api/stations/search?city=Porto")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].city", is("Porto")));
    }


    @Test
    void whenPostInvalidStation_thenReturnBadRequest() throws Exception {
        ChargingSpot invalidSpot = new ChargingSpot(); // Missing required fields

        mockMvc.perform(post("/api/stations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidSpot)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void whenPutValidStation_thenUpdateStation() throws Exception {
        when(chargingSpotRepository.existsById(1L)).thenReturn(true);
        when(chargingSpotService.updateChargingSpot(eq(1L), any(ChargingSpot.class))).thenReturn(spot1);
        when(chargingSpotService.getChargingSpotById(1L)).thenReturn(spot1);

        mockMvc.perform(put("/api/stations/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(spot1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city", is(spot1.getCity())));

        verify(chargingSpotService, times(1)).updateChargingSpot(eq(1L), any(ChargingSpot.class));
    }

    @Test
    void whenPutInvalidStation_thenReturnNotFound() throws Exception {
        when(chargingSpotRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(put("/api/stations/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(spot1)))
                .andExpect(status().isNotFound());
    }



@Test
void whenGetAvailableBikes_thenReturnOnlyAvailableBikes() throws Exception {
    Bike bike1 = new Bike();
    bike1.setId(1L);
    bike1.setIsAvailable(true);

    Bike bike2 = new Bike();
    bike2.setId(2L);
    bike2.setIsAvailable(true);

    Set<Bike> availableBikes = new HashSet<>(Set.of(bike1, bike2));

    when(chargingSpotRepository.existsById(1L)).thenReturn(true);
    when(chargingSpotService.getAvailableBikes(1L)).thenReturn(availableBikes);

    mockMvc.perform(get("/api/stations/1/available")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[*].isAvailable", everyItem(is(true))))
            .andExpect(jsonPath("$[*].id", containsInAnyOrder(1, 2)));

    verify(chargingSpotService, times(1)).getAvailableBikes(1L);
}



@Test
void whenGetAvailableBikesForInvalidId_thenReturnNotFound() throws Exception {
    when(chargingSpotRepository.existsById(99L)).thenReturn(false);

    mockMvc.perform(get("/api/stations/99/available")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());

    verify(chargingSpotService, never()).getAvailableBikes(anyLong());
}


    @Test
    void whenDeleteExistingStation_thenReturnOk() throws Exception {
        when(chargingSpotRepository.existsById(1L)).thenReturn(true);
        doNothing().when(chargingSpotRepository).deleteById(1L);

        mockMvc.perform(delete("/api/stations/1"))
                .andExpect(status().isOk());

        verify(chargingSpotRepository, times(1)).deleteById(1L);
    }

    @Test
    void whenDeleteNonExistingStation_thenReturnNotFound() throws Exception {
        when(chargingSpotRepository.existsById(99L)).thenReturn(false);

        mockMvc.perform(delete("/api/stations/99"))
                .andExpect(status().isNotFound());

        verify(chargingSpotRepository, never()).deleteById(anyLong());
    }
}