// package tqs.project.jolteon.services;

// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import static org.assertj.core.api.Assertions.assertThat;

// import tqs.project.jolteon.entities.ChargingSpot;
// import tqs.project.jolteon.repositories.ChargingSpotRepository;

// import java.util.List;

// @SpringBootTest
// public class DatabaseResetServiceTest {

//     @Autowired
//     private DatabaseResetService databaseResetService;

//     @Autowired
//     private ChargingSpotRepository chargingSpotRepository;

//     @Test
//     public void testResetDatabase_clearsAndSeedsCharginSpots() {
//         // Given: manually add a CharginSpot (simulating a dirty state)
//         ChargingSpot custom = new ChargingSpot();
//         custom.setCity("Testville");
//         custom.setLatitude(1.0f);
//         custom.setLongitude(1.0f);
//         custom.setCapacity(99);
//         chargingSpotRepository.save(custom);
        
//         // When: reset the database
//         databaseResetService.resetDatabase();

//         // Then: the CharginSpots should be seeded (not contain the test CharginSpot)
//         List<ChargingSpot> CharginSpots = chargingSpotRepository.findAll();
//         assertThat(CharginSpots).isNotEmpty();
//         assertThat(CharginSpots)
//             .noneMatch(s -> s.getCity().equals("Testville"));
//     }
// }
