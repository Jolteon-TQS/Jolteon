package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import tqs.project.jolteon.entities.CityAdmin;
import tqs.project.jolteon.repositories.CityAdminRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CityAdminServiceTest {

    private CityAdminRepository cityAdminRepository;
    private CityAdminService cityAdminService;

    @BeforeEach
    void setUp() {
        cityAdminRepository = Mockito.mock(CityAdminRepository.class);
        cityAdminService = new CityAdminService(cityAdminRepository);
    }

    @Test
    void testAddCityAdmin() {
        CityAdmin admin = new CityAdmin();
        when(cityAdminRepository.save(admin)).thenReturn(admin);

        CityAdmin result = cityAdminService.addCityAdmin(admin);

        assertEquals(admin, result);
        verify(cityAdminRepository, times(1)).save(admin);
    }

    @Test
    void testGetAllCityAdmins() {
        List<CityAdmin> admins = Arrays.asList(new CityAdmin(), new CityAdmin());
        when(cityAdminRepository.findAll()).thenReturn(admins);

        List<CityAdmin> result = cityAdminService.getAllCityAdmins();

        assertEquals(2, result.size());
        verify(cityAdminRepository, times(1)).findAll();
    }

    @Test
    void testGetCityAdminByIdFound() {
        CityAdmin admin = new CityAdmin();
        admin.setId(1L);

        when(cityAdminRepository.findById(1L)).thenReturn(Optional.of(admin));

        CityAdmin result = cityAdminService.getCityAdminById(1L);

        assertEquals(admin, result);
        verify(cityAdminRepository, times(1)).findById(1L);
    }

    @Test
    void testGetCityAdminByIdNotFound() {
        when(cityAdminRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            cityAdminService.getCityAdminById(999L);
        });

        assertTrue(exception.getMessage().contains("City admin not found"));
        verify(cityAdminRepository, times(1)).findById(999L);
    }
}
