package tqs.project.jolteon.services;

import org.springframework.stereotype.Service;
import tqs.project.jolteon.entities.CityAdmin;
import tqs.project.jolteon.repositories.CityAdminRepository;
import java.util.List;


@Service
public class CityAdminService {

    private final CityAdminRepository cityAdminRepository;

    public CityAdminService(CityAdminRepository cityAdminRepository) {
        this.cityAdminRepository = cityAdminRepository;
    }

    public CityAdmin addCityAdmin(CityAdmin cityAdmin) {
        return cityAdminRepository.save(cityAdmin);
    }

    public List<CityAdmin> getAllCityAdmins() {
        return cityAdminRepository.findAll();
    }

    public CityAdmin getCityAdminById(Long id) {
        return cityAdminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("City admin not found with id: " + id));
    }

    
    
}
