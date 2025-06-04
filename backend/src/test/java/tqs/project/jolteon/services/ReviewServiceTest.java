package tqs.project.jolteon.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.entities.Review;
import tqs.project.jolteon.repositories.ReviewRepository;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    private ReviewRepository reviewRepository;
    private CulturalLandmarkService culturalLandmarkService;
    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        reviewRepository = Mockito.mock(ReviewRepository.class);
        culturalLandmarkService = Mockito.mock(CulturalLandmarkService.class);
        reviewService = new ReviewService(reviewRepository, culturalLandmarkService);
    }

    @Test
    void testAddReviewSuccess() {
        Review review = new Review();
        NormalUser user = new NormalUser();
        user.setId(1L);
        review.setUser(user);

        CulturalLandmark landmark = new CulturalLandmark();
        landmark.setId(10L);
        review.setCulturalLandmark(landmark);

        Review result = reviewService.addReview(review);

        assertEquals(review, result);
        verify(culturalLandmarkService, times(1)).updateCulturalLandmark(landmark);
    }

    @Test
    void testAddReviewNoUser() {
        Review review = new Review();
        review.setUser(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            reviewService.addReview(review);
        });

        assertTrue(exception.getMessage().contains("User cannot be null"));
        verify(culturalLandmarkService, never()).updateCulturalLandmark(any());
    }

    @Test
    void testDeleteReview() {
        Long id = 1L;
        reviewService.deleteReview(id);
        verify(reviewRepository, times(1)).deleteById(id);
    }

    @Test
    void testGetAllReviews() {
        List<Review> reviews = Arrays.asList(new Review(), new Review());
        when(reviewRepository.findAll()).thenReturn(reviews);
        List<Review> result = reviewService.getAllReviews();
        assertEquals(2, result.size());
        verify(reviewRepository, times(1)).findAll();
    }

    @Test
    void testGetReviewsByCulturalLandmarkId() {
        CulturalLandmark l1 = new CulturalLandmark();
        l1.setId(1L);
        CulturalLandmark l2 = new CulturalLandmark();
        l2.setId(2L);

        Review r1 = new Review();
        r1.setCulturalLandmark(l1);
        Review r2 = new Review();
        r2.setCulturalLandmark(l2);

        when(reviewRepository.findAll()).thenReturn(Arrays.asList(r1, r2));

        List<Review> result = reviewService.getReviewsByCulturalLandmarkId(1L);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getCulturalLandmark().getId());
    }

    @Test
    void testGetReviewsByUserId() {
        NormalUser u1 = new NormalUser();
        u1.setId(1L);
        NormalUser u2 = new NormalUser();
        u2.setId(2L);

        Review r1 = new Review();
        r1.setUser(u1);
        Review r2 = new Review();
        r2.setUser(u2);

        when(reviewRepository.findAll()).thenReturn(Arrays.asList(r1, r2));

        List<Review> result = reviewService.getReviewsByUserId(2L);
        assertEquals(1, result.size());
        assertEquals(2L, result.get(0).getUser().getId());
    }
}
