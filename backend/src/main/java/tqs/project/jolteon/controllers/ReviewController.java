package tqs.project.jolteon.controllers;

import org.springframework.web.bind.annotation.*;
import tqs.project.jolteon.entities.Review;
import tqs.project.jolteon.entities.DTOs.ReviewDTO;
import tqs.project.jolteon.entities.DTOs.ReviewMapper;
import tqs.project.jolteon.services.NormalUserService;
import tqs.project.jolteon.services.ReviewService;
import org.springframework.http.ResponseEntity;

import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.services.CulturalLandmarkService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final NormalUserService normalUserService;
    private final CulturalLandmarkService culturalLandmarkService;

    public ReviewController(ReviewService reviewService, NormalUserService normalUserService,
            CulturalLandmarkService culturalLandmarkService) {
        this.reviewService = reviewService;
        this.normalUserService = normalUserService;
        this.culturalLandmarkService = culturalLandmarkService;
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDTO) {
        NormalUser normalUser = normalUserService.getNormalUserById(reviewDTO.getUser());
        CulturalLandmark culturalLandmark = culturalLandmarkService
                .getCulturalLandmarkById(reviewDTO.getCulturalLandmark());
        Review saved = reviewService.addReview(ReviewMapper.toEntity(reviewDTO, normalUser, culturalLandmark));

        return ResponseEntity.ok(ReviewMapper.toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cultural-landmark/{culturalLandmarkId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByCulturalLandmarkId(@PathVariable Long culturalLandmarkId) {
        List<ReviewDTO> dtos = reviewService.getReviewsByCulturalLandmarkId(culturalLandmarkId)
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Long userId) {
        List<ReviewDTO> dtos = reviewService.getReviewsByUserId(userId)
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        List<ReviewDTO> dtos = reviewService.getAllReviews()
                .stream()
                .map(ReviewMapper::toDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }

}
