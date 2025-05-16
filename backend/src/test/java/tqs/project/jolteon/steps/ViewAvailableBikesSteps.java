package tqs.project.jolteon.steps;

import io.cucumber.java.en.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;

// TODO: Coordinate frontend Selenium tests with this step definition to fully cover the User Story
// With just this, the step "they should see pins for nearby bikes with battery levels" is not covered
public class ViewAvailableBikesSteps {

    private double latitude;
    private double longitude;
    private ResponseEntity<List<Map<String, Object>>> response;

    private final String BASE_URL = "http://localhost:8080/api/bikes/nearby";

    @Given("the user is located at latitude {double} and longitude {double}")
    public void the_user_is_located(double lat, double lng) {
        this.latitude = lat;
        this.longitude = lng;
    }

    @When("they request available bikes from the API")
    public void they_request_available_bikes_from_the_api() {
        String url = String.format("%s?lat=%f&lng=%f", BASE_URL, latitude, longitude);
        RestTemplate restTemplate = new RestTemplate();

        // Assuming the API returns a list of bikes (JSON array)
        response = restTemplate.getForEntity(url, (Class<List<Map<String, Object>>>) (Class<?>) List.class);
    }

    @Then("they should receive a list of bikes with location and battery information")
    public void they_should_receive_a_list_of_bikes_with_location_and_battery() {
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isEmpty());

        Map<String, Object> firstBike = response.getBody().get(0);
        assertTrue(firstBike.containsKey("latitude"));
        assertTrue(firstBike.containsKey("longitude"));
        assertTrue(firstBike.containsKey("battery"));
    }
}
