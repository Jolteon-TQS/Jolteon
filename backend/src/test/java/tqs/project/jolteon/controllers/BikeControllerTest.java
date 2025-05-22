package tqs.project.jolteon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;
import tqs.project.jolteon.entities.DTOs.BikeDTO;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.services.BikeService;
import tqs.project.jolteon.services.ChargingSpotService;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BikeController.class)
class BikeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BikeService bikeService;

    @MockBean
    private ChargingSpotService chargingSpotService;

    @Autowired
    private ObjectMapper objectMapper;

    private Bike bike1, bike2;
    private ChargingSpot spot;

    @BeforeEach
    void setUp() {
        spot = new ChargingSpot();
        spot.setId(100L);

        bike1 = new Bike();
        bike1.setId(1L);
        bike1.setCity("Lisbon");
        bike1.setChargingSpot(spot);
        // Set other necessary fields

        bike2 = new Bike();
        bike2.setId(2L);
        bike2.setCity("Porto");
        bike2.setChargingSpot(spot);
        // Set other necessary fields
    }

    @Test
    void testGetAllBikes() throws Exception {
        List<Bike> bikes = List.of(bike1, bike2);
        Mockito.when(bikeService.getAllBikes()).thenReturn(bikes);

        mockMvc.perform(get("/api/bikes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(bikes.size()));
    }

    @Test
    void testSearchBikesByCity() throws Exception {
        List<Bike> bikes = List.of(bike1, bike2);
        Mockito.when(bikeService.getAllBikes()).thenReturn(bikes);

        mockMvc.perform(get("/api/bikes/search").param("city", "Lisbon"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].city").value("Lisbon"));
    }

    @Test
    void testGetBikeByIdFound() throws Exception {
        Mockito.when(bikeService.getBikeById(1L)).thenReturn(Optional.of(bike1));

        mockMvc.perform(get("/api/bikes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testGetBikeByIdNotFound() throws Exception {
        Mockito.when(bikeService.getBikeById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/bikes/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAvailableBikesNearLocation() throws Exception {
        List<Bike> bikes = List.of(bike1);
        Mockito.when(bikeService.getAvailableBikesNearLocation(anyFloat(), anyFloat()))
                .thenReturn(bikes);

        mockMvc.perform(get("/api/bikes/available")
                        .param("latitude", "38.7169")
                        .param("longitude", "-9.1399"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testCreateBike() throws Exception {
        Mockito.when(chargingSpotService.getChargingSpotById(100L)).thenReturn(spot);
        Mockito.when(bikeService.saveBike(any(Bike.class))).thenReturn(bike1);

        BikeDTO dto = new BikeDTO();
        dto.setId(1L);
        dto.setCity("Lisbon");
        dto.setChargingSpotId(100L);
        // Set other necessary DTO fields

        mockMvc.perform(post("/api/bikes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testUpdateBikeSuccess() throws Exception {
        Mockito.when(chargingSpotService.getChargingSpotById(100L)).thenReturn(spot);

        Bike updated = new Bike();
        updated.setId(1L);
        updated.setCity("UpdatedCity");
        updated.setChargingSpot(spot);
        // Set other necessary fields

        Mockito.when(bikeService.updateBike(eq(1L), any(Bike.class))).thenReturn(updated);

        BikeDTO dto = new BikeDTO();
        dto.setId(1L);
        dto.setCity("UpdatedCity");
        dto.setChargingSpotId(100L);
        // Set other necessary DTO fields

        mockMvc.perform(put("/api/bikes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("UpdatedCity"));
    }

    @Test
    void testUpdateBikeNotFound() throws Exception {
        Mockito.when(chargingSpotService.getChargingSpotById(100L)).thenReturn(spot);
        Mockito.when(bikeService.updateBike(eq(99L), any(Bike.class)))
                .thenThrow(new RuntimeException("Bike not found"));

        BikeDTO dto = new BikeDTO();
        dto.setId(99L);
        dto.setCity("Whatever");
        dto.setChargingSpotId(100L);
        // Set other necessary DTO fields

        mockMvc.perform(put("/api/bikes/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteBike() throws Exception {
        Mockito.doNothing().when(bikeService).deleteBike(1L);

        mockMvc.perform(delete("/api/bikes/1"))
                .andExpect(status().isNoContent());
    }
}
