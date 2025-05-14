package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
