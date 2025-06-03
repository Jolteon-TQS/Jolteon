package tqs.project.jolteon.controllers;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tqs.project.jolteon.entities.BikeRenting;
import tqs.project.jolteon.entities.DTOs.BikeRentingDTO;
import tqs.project.jolteon.entities.DTOs.BikeRentingMapper;
import tqs.project.jolteon.services.BikeRentingService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import tqs.project.jolteon.entities.Bike;
import tqs.project.jolteon.entities.NormalUser;

@WebMvcTest(BikeRentingController.class)
class BikeRentingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BikeRentingService bikeRentingService;

    private BikeRenting createBikeRentingEntity(Long id) {
        BikeRenting br = new BikeRenting();
        br.setId(id);
        br.setTime(LocalDateTime.of(2023, 1, 1, 10, 0));
        br.setEndTime(LocalDateTime.of(2023, 1, 1, 11, 0));

        // Create and set a Bike with an ID (since mapper uses bike.getId())
        Bike bike = new Bike();
        bike.setId(100L);
        br.setBike(bike);

        NormalUser user = new NormalUser();
        user.setId(200L);
        br.setUser(user);

        // Similarly, if your mapper accesses user, spots, etc, mock them here too

        return br;
    }


@Test
void getActiveRenting_returnsBikeRentingDTO_whenFound() throws Exception {
    BikeRenting renting = createBikeRentingEntity(1L);
    Mockito.when(bikeRentingService.getActiveRentingForUser(anyLong()))
            .thenReturn(Optional.of(renting));

    mockMvc.perform(get("/api/rentings/active/42"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(renting.getId()))
            .andExpect(jsonPath("$.time").value("2023-01-01T10:00:00"));
}


    @Test
    void getActiveRenting_returns404_whenNotFound() throws Exception {
        Mockito.when(bikeRentingService.getActiveRentingForUser(anyLong()))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/rentings/active/42"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllRentings_returnsListOfBikeRentingDTO() throws Exception {
        BikeRenting renting1 = createBikeRentingEntity(1L);
        BikeRenting renting2 = createBikeRentingEntity(2L);

        List<BikeRenting> rentings = List.of(renting1, renting2);

        Mockito.when(bikeRentingService.getAllRentings())
                .thenReturn(rentings);

        List<BikeRentingDTO> dtos = rentings.stream()
                .map(BikeRentingMapper::toDTO)
                .toList();

        mockMvc.perform(get("/api/rentings"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(dtos.size()))
                .andExpect(jsonPath("$[0].id").value(dtos.get(0).getId()))
                .andExpect(jsonPath("$[1].id").value(dtos.get(1).getId()));
    }
}
