package tqs.project.jolteon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.ChargingSpot;
import tqs.project.jolteon.services.OperatorService;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OperatorController.class)
class OperatorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OperatorService operatorService;

    @Autowired
    private ObjectMapper objectMapper;

    private Bike bike;
    private ChargingSpot chargingSpot;

    @BeforeEach
    void setUp() {
        bike = new Bike();
        bike.setId(1L);
        chargingSpot = new ChargingSpot();
        chargingSpot.setId(1L);
    }

    @Test
    void testCreateBike() throws Exception {
        when(operatorService.createBike(any())).thenReturn(bike);
        mockMvc.perform(post("/api/operators/createBike")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bike)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testDeleteBike() throws Exception {
        doNothing().when(operatorService).deleteBike(1L);
        mockMvc.perform(delete("/api/operators/deleteBike")
                .contentType(MediaType.APPLICATION_JSON)
                .content("1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testCreateChargingSpot() throws Exception {
        when(operatorService.createChargingSpot(any())).thenReturn(chargingSpot);
        mockMvc.perform(post("/api/operators/createChargingSpot")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(chargingSpot)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testDeleteChargingSpot() throws Exception {
        doNothing().when(operatorService).deleteChargingSpot(1L);
        mockMvc.perform(delete("/api/operators/deleteChargingSpot")
                .contentType(MediaType.APPLICATION_JSON)
                .content("1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetBikeStatusFound() throws Exception {
        when(operatorService.getBikeStatus(1L)).thenReturn(Optional.of(bike));
        mockMvc.perform(get("/api/operators/bikeStatus/1"))
                .andExpect(status().isOk());    }


    @Test
    void testGetBikeStatusNotFound() throws Exception {
        when(operatorService.getBikeStatus(1L)).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/operators/bikeStatus/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetBikesInOperatorCity() throws Exception {
        when(operatorService.getBikesInOperatorCity(1L)).thenReturn(List.of(bike));
        mockMvc.perform(get("/api/operators/bikesInCity")
                .param("operatorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
