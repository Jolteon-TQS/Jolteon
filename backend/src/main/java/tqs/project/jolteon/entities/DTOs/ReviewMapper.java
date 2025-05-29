package tqs.project.jolteon.entities.DTOs;

import tqs.project.jolteon.entities.Review;
import tqs.project.jolteon.entities.NormalUser;
import tqs.project.jolteon.entities.CulturalLandmark;

public class ReviewMapper {
    public static ReviewDTO toDTO(Review review) {
        return new ReviewDTO(
                review.getStars(),
                review.getDescription(),
                review.getUser().getId(),
                review.getCulturalLandmark().getId()
        );
    }

    public static Review toEntity(ReviewDTO reviewDTO, NormalUser user, CulturalLandmark culturalLandmark) {
        Review review = new Review();
        review.setStars(reviewDTO.getStars());
        review.setDescription(reviewDTO.getDescription());
        review.setUser(user);
        review.setCulturalLandmark(culturalLandmark);
        return review;
    }
    
}
