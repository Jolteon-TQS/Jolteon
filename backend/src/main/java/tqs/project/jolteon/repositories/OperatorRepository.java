package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.Operator;

public interface OperatorRepository extends JpaRepository<Operator, Long> {
}
