package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.repositories.NormalUserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NormalUserServiceTest {

    private NormalUserRepository normalUserRepository;
    private NormalUserService normalUserService;

    @BeforeEach
    void setUp() {
        normalUserRepository = Mockito.mock(NormalUserRepository.class);
        normalUserService = new NormalUserService(normalUserRepository);
    }

    @Test
    void testAddNormalUser() {
        NormalUser user = new NormalUser();
        when(normalUserRepository.save(user)).thenReturn(user);
        NormalUser result = normalUserService.addNormalUser(user);
        assertEquals(user, result);
        verify(normalUserRepository, times(1)).save(user);
    }

    @Test
    void testDeleteNormalUser() {
        Long id = 1L;
        normalUserService.deleteNormalUser(id);
        verify(normalUserRepository, times(1)).deleteById(id);
    }

    @Test
    void testGetAllNormalUsers() {
        List<NormalUser> users = Arrays.asList(new NormalUser(), new NormalUser());
        when(normalUserRepository.findAll()).thenReturn(users);
        List<NormalUser> result = normalUserService.getAllNormalUsers();
        assertEquals(2, result.size());
        verify(normalUserRepository, times(1)).findAll();
    }

    @Test
    void testGetNormalUserByIdFound() {
        NormalUser user = new NormalUser();
        user.setId(1L);
        when(normalUserRepository.findById(1L)).thenReturn(Optional.of(user));
        NormalUser result = normalUserService.getNormalUserById(1L);
        assertEquals(user, result);
        verify(normalUserRepository, times(1)).findById(1L);
    }

    @Test
    void testGetNormalUserByIdNotFound() {
        when(normalUserRepository.findById(999L)).thenReturn(Optional.empty());
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            normalUserService.getNormalUserById(999L);
        });
        assertTrue(exception.getMessage().contains("Normal user not found"));
        verify(normalUserRepository, times(1)).findById(999L);
    }
}
