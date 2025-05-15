package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.Operator;
import org.springframework.stereotype.Repository;


@Repository
public interface OperatorRepository extends JpaRepository<Operator, Long> {
}
