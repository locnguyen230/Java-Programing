package com.careermate.dto.career;

import java.util.List;

/**
 * Request payload for /api/career/search-direction.
 */
public record SearchDirectionRequestDto(
                String targetCareer,
                String currentProfile,
                String resumeText,
                List<String> currentSkills,
                String preferences,
                String location,
                String experienceLevel) {
}
