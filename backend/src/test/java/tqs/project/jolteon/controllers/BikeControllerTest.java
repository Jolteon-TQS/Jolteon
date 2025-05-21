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
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.services.BikeService;

import java.util.Arrays;
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

    @Autowired
    private ObjectMapper objectMapper;

    private Bike bike1, bike2;

    @BeforeEach
    void setUp() {
        bike1 = new Bike();
        bike1.setId(1L);
        bike1.setCity("Lisbon");

        bike2 = new Bike();
        bike2.setId(2L);
        bike2.setCity("Porto");
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
        Mockito.when(bikeService.saveBike(any(Bike.class))).thenReturn(bike1);

        mockMvc.perform(post("/api/bikes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bike1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testUpdateBikeSuccess() throws Exception {
        Bike updatedBike = new Bike();
        updatedBike.setId(1L);
        updatedBike.setCity("UpdatedCity");

        Mockito.when(bikeService.updateBike(eq(1L), any(Bike.class))).thenReturn(updatedBike);

        mockMvc.perform(put("/api/bikes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedBike)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("UpdatedCity"));
    }

    @Test
    void testUpdateBikeNotFound() throws Exception {
        Mockito.when(bikeService.updateBike(eq(99L), any(Bike.class)))
                .thenThrow(new RuntimeException("Bike not found"));

        mockMvc.perform(put("/api/bikes/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bike1)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteBike() throws Exception {
        Mockito.doNothing().when(bikeService).deleteBike(1L);

        mockMvc.perform(delete("/api/bikes/1"))
                .andExpect(status().isNoContent());
    }
}

