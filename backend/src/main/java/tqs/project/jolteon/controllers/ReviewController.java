package tqs.project.jolteon.controllers;

import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.entities.Review;
import tqs.project.jolteon.services.ReviewService;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<Review> createReview(Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cultural-landmark/{culturalLandmarkId}")
    public ResponseEntity<List<Review>> getReviewsByCulturalLandmarkId(@PathVariable Long culturalLandmarkId) {
        List<Review> reviews = reviewService.getReviewsByCulturalLandmarkId(culturalLandmarkId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
}
