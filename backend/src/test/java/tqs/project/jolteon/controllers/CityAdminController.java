package tqs.project.jolteon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import tqs.project.jolteon.entities.CityAdmin;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.DTOs.CulturalLandmarkDTO;
import tqs.project.jolteon.services.CityAdminService;
import tqs.project.jolteon.services.CulturalLandmarkService;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CityAdminController.class)
class CityAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CityAdminService cityAdminService;

    @MockBean
    private CulturalLandmarkService culturalLandmarkService;

    @Autowired
    private ObjectMapper objectMapper;

    private CityAdmin cityAdmin;
    private CulturalLandmark culturalLandmark;
    private CulturalLandmarkDTO landmarkDTO;

    @BeforeEach
    void setUp() {
        cityAdmin = new CityAdmin();
        cityAdmin.setId(1L);
        cityAdmin.setCity("Lisboa");

        culturalLandmark = new CulturalLandmark();
        culturalLandmark.setId(1L);

        landmarkDTO = new CulturalLandmarkDTO();
        landmarkDTO.setId(1L);
    }

    @Test
    void testAddCityAdmin() throws Exception {
        when(cityAdminService.addCityAdmin(any())).thenReturn(cityAdmin);
        mockMvc.perform(post("/api/city-admin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cityAdmin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value(1L));
    }

    @Test
    void testGetAllCityAdmins() throws Exception {
        when(cityAdminService.getAllCityAdmins()).thenReturn(List.of(cityAdmin));
        mockMvc.perform(get("/api/city-admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testGetCulturalLandmarkByCityAdminIdFound() throws Exception {
        when(cityAdminService.getCityAdminById(1L)).thenReturn(cityAdmin);
        when(culturalLandmarkService.getCulturalLandmarksByCity("Lisboa"))
                .thenReturn(List.of(culturalLandmark));

        mockMvc.perform(get("/api/city-admin/1/cultural-landmarks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void testGetCulturalLandmarkByCityAdminIdNotFound() throws Exception {
        when(cityAdminService.getCityAdminById(999L)).thenReturn(null);

        mockMvc.perform(get("/api/city-admin/999/cultural-landmarks"))
                .andExpect(status().isNotFound());
    }
}
