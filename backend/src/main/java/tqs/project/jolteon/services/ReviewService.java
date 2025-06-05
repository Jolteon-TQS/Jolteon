package tqs.project.jolteon.services;

import org.springframework.stereotype.Service;
import tqs.project.jolteon.entities.Review;
import tqs.project.jolteon.repositories.ReviewRepository;
import tqs.project.jolteon.entities.CulturalLandmark;


import java.util.List;


@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CulturalLandmarkService culturalLandmarkService;

    public ReviewService(ReviewRepository reviewRepository, 
                         CulturalLandmarkService culturalLandmarkService) {
        this.culturalLandmarkService = culturalLandmarkService;
        this.reviewRepository = reviewRepository;
    }

    public Review addReview(Review review) {
        if (review.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        CulturalLandmark culturalLandmark = review.getCulturalLandmark();
        culturalLandmark.getReviews().add(review);
        culturalLandmarkService.updateCulturalLandmark(culturalLandmark);
        return review;
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public List<Review> getReviewsByCulturalLandmarkId(Long culturalLandmarkId) {
        return reviewRepository.findAll().stream()
                .filter(review -> review.getCulturalLandmark().getId().equals(culturalLandmarkId))
                .toList();
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findAll().stream()
                .filter(review -> review.getUser().getId().equals(userId))
                .toList();
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
}
