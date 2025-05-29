package tqs.project.jolteon.services;

import org.springframework.stereotype.Service;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.repositories.NormalUserRepository;

import java.util.List;

@Service
public class NormalUserService {
    private final NormalUserRepository normalUserRepository;
    public NormalUserService(NormalUserRepository normalUserRepository) {
        this.normalUserRepository = normalUserRepository;
    }

    public NormalUser addNormalUser(NormalUser normalUser) {
        return normalUserRepository.save(normalUser);
    }
    public void deleteNormalUser(Long id) {
        normalUserRepository.deleteById(id);
    }
    public List<NormalUser> getAllNormalUsers() {
        return normalUserRepository.findAll();
    }
    public NormalUser getNormalUserById(Long id) {
        return normalUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Normal user not found with id: " + id));
    }
    
}
