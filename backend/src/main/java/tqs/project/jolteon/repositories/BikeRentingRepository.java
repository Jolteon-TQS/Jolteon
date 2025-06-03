package tqs.project.jolteon.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tqs.project.jolteon.entities.BikeRenting;
import org.springframework.stereotype.Repository;
import java.util.Set;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface BikeRentingRepository extends JpaRepository<BikeRenting, Long> {
    Set<BikeRenting> findByUserId(Long userId);

    @Query("SELECT br FROM BikeRenting br WHERE br.user.id = :userId AND br.endTime IS NULL AND br.endSpot IS NULL")
    Optional<BikeRenting> findActiveRentingByUserId(@Param("userId") Long userId);
}
