package tqs.project.jolteon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.DTOs.CulturalLandmarkDTO;
import tqs.project.jolteon.services.CulturalLandmarkService;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CulturalLandmarkController.class)
class CulturalLandmarkControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CulturalLandmarkService culturalLandmarkService;

    @Autowired
    private ObjectMapper objectMapper;

    private CulturalLandmark landmark;
    private CulturalLandmarkDTO landmarkDTO;

    @BeforeEach
    void setUp() {
        landmark = new CulturalLandmark();
        landmark.setId(1L);
        landmark.setName("Museu de Aveiro");
        landmark.setCity("Aveiro");
        landmark.setDescription("Antigo Convento de Jesus, agora museu com arte sacra e história local.");

        landmarkDTO = new CulturalLandmarkDTO();
        landmarkDTO.setId(1L);
        landmarkDTO.setName("Museu de Aveiro");
        landmarkDTO.setCity("Aveiro");
        landmarkDTO.setDescription("Antigo Convento de Jesus, agora museu com arte sacra e história local.");
    }

    @Test
    void testAddCulturalLandmark() throws Exception {
        when(culturalLandmarkService.addCulturalLandmark(any())).thenReturn(landmark);

        mockMvc.perform(post("/api/cultural-landmarks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(landmarkDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Museu de Aveiro"))
                .andExpect(jsonPath("$.city").value("Aveiro"));
    }

    @Test
    void testDeleteCulturalLandmark() throws Exception {
        doNothing().when(culturalLandmarkService).deleteCulturalLandmark(1L);

        mockMvc.perform(delete("/api/cultural-landmarks/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetAllCulturalLandmarks() throws Exception {
        when(culturalLandmarkService.getAllCulturalLandmarks()).thenReturn(List.of(landmark));

        mockMvc.perform(get("/api/cultural-landmarks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].city").value("Aveiro"));
    }

    @Test
    void testGetCulturalLandmarkById() throws Exception {
        when(culturalLandmarkService.getCulturalLandmarkById(1L)).thenReturn(landmark);

        mockMvc.perform(get("/api/cultural-landmarks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Museu de Aveiro"))
                .andExpect(jsonPath("$.city").value("Aveiro"));
    }

    @Test
    void testUpdateCulturalLandmarkFound() throws Exception {
        when(culturalLandmarkService.updateCulturalLandmark(any())).thenReturn(landmark);

        mockMvc.perform(put("/api/cultural-landmarks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(landmarkDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.city").value("Aveiro"));
    }

    @Test
    void testUpdateCulturalLandmarkNotFound() throws Exception {
        when(culturalLandmarkService.updateCulturalLandmark(any())).thenReturn(null);

        mockMvc.perform(put("/api/cultural-landmarks/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(landmarkDTO)))
                .andExpect(status().isNotFound());
    }


    @Test
    void testGetCulturalLandmarksByCity() throws Exception {
        when(culturalLandmarkService.getCulturalLandmarksByCity("Aveiro")).thenReturn(List.of(landmark));
        mockMvc.perform(get("/api/cultural-landmarks/search")
                .param("city", "Aveiro"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Museu de Aveiro"))
                .andExpect(jsonPath("$[0].city").value("Aveiro"));

        verify(culturalLandmarkService, times(1)).getCulturalLandmarksByCity("Aveiro");

    }

}
