package tqs.project.jolteon.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.entities.Review;
import tqs.project.jolteon.entities.DTOs.ReviewDTO;
import tqs.project.jolteon.services.CulturalLandmarkService;
import tqs.project.jolteon.services.NormalUserService;
import tqs.project.jolteon.services.ReviewService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;

    @MockBean
    private NormalUserService normalUserService;

    @MockBean
    private CulturalLandmarkService culturalLandmarkService;

    @Autowired
    private ObjectMapper objectMapper;

    private Review review;
    private ReviewDTO reviewDTO;
    private NormalUser user;
    private CulturalLandmark landmark;

    @BeforeEach
    void setUp() {
        user = new NormalUser();
        user.setId(1L);

        landmark = new CulturalLandmark();
        landmark.setId(2L);

        review = new Review();
        review.setId(3L);
        review.setUser(user);
        review.setCulturalLandmark(landmark);
        review.setStars(5);
        review.setDescription("Excelente!");

        reviewDTO = new ReviewDTO(3L, 5, "Excelente!", 1L, 2L);
    }

    @Test
    void testCreateReview() throws Exception {
        when(normalUserService.getNormalUserById(1L)).thenReturn(user);
        when(culturalLandmarkService.getCulturalLandmarkById(2L)).thenReturn(landmark);
        when(reviewService.addReview(any())).thenReturn(review);

        mockMvc.perform(post("/api/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3L))
                .andExpect(jsonPath("$.stars").value(5))
                .andExpect(jsonPath("$.description").value("Excelente!"))
                .andExpect(jsonPath("$.user").value(1L))
                .andExpect(jsonPath("$.culturalLandmark").value(2L));
    }

    @Test
    void testDeleteReview() throws Exception {
        doNothing().when(reviewService).deleteReview(3L);

        mockMvc.perform(delete("/api/reviews/3"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetAllReviews() throws Exception {
        when(reviewService.getAllReviews()).thenReturn(List.of(review));

        mockMvc.perform(get("/api/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(3L));
    }

    @Test
    void testGetReviewsByUserId() throws Exception {
        when(reviewService.getReviewsByUserId(1L)).thenReturn(List.of(review));

        mockMvc.perform(get("/api/reviews/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].user").value(1L));
    }

    @Test
    void testGetReviewsByCulturalLandmarkId() throws Exception {
        when(reviewService.getReviewsByCulturalLandmarkId(2L)).thenReturn(List.of(review));

        mockMvc.perform(get("/api/reviews/cultural-landmark/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].culturalLandmark").value(2L));
    }
}
