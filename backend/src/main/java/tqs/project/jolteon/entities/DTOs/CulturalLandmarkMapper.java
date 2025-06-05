package tqs.project.jolteon.entities.DTOs;

import java.util.stream.Collectors;

import tqs.project.jolteon.entities.CulturalLandmark;
import tqs.project.jolteon.entities.Review;

import java.util.Set;

public class CulturalLandmarkMapper {
    public static CulturalLandmarkDTO toDTO(CulturalLandmark culturalLandmark) {
        // Set<ReviewDTO> reviews = Set.of();
        // if (culturalLandmark.getReviews() != null) {
        //     reviews = culturalLandmark.getReviews().stream()
        //             .map(ReviewMapper::toDTO)
        //             .collect(Collectors.toSet());
        // }
        Double averageRating;
        if (culturalLandmark.getReviews() == null || culturalLandmark.getReviews().isEmpty()){
            averageRating = 0.0;
        } else {
            averageRating = culturalLandmark.getReviews().stream()
                    .mapToDouble(Review::getStars)
                    .average()
                    .orElse(0.0);
        }
        return new CulturalLandmarkDTO(
                culturalLandmark.getId(),
                culturalLandmark.getName(),
                culturalLandmark.getCity(),
                culturalLandmark.getDescription(),
                culturalLandmark.getImageUrl(),
                culturalLandmark.getLatitude(),
                culturalLandmark.getLongitude(),
                averageRating
                );

    }

    public static CulturalLandmark toEntity(CulturalLandmarkDTO culturalLandmarkDTO) {
        CulturalLandmark culturalLandmark = new CulturalLandmark();
        culturalLandmark.setId(culturalLandmarkDTO.getId());
        culturalLandmark.setName(culturalLandmarkDTO.getName());
        culturalLandmark.setCity(culturalLandmarkDTO.getCity());
        culturalLandmark.setDescription(culturalLandmarkDTO.getDescription());
        culturalLandmark.setImageUrl(culturalLandmarkDTO.getImageUrl());
        culturalLandmark.setLatitude(culturalLandmarkDTO.getLatitude());
        culturalLandmark.setLongitude(culturalLandmarkDTO.getLongitude());
        // if (culturalLandmarkDTO.getReviews() == null) {
        //     culturalLandmark.setReviews(Set.of());
        // } else {
        //     culturalLandmark.setReviews(culturalLandmarkDTO.getReviews().stream()
        //             .map(reviewDTO -> ReviewMapper.toEntity(reviewDTO, null, culturalLandmark))
        //             .collect(Collectors.toSet()));
        // }
        return culturalLandmark;
    }
}
