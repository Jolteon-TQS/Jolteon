package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
}
