package com.careermate.dto.career;

import java.util.List;
import java.util.Map;

/**
 * Response payload for /api/career/search-direction.
 */
public record SearchDirectionResponseDto(
                String summary,
                List<String> actionPlan,
                List<String> recommendedKeywords,
                Map<String, Object> filterSuggestion) {
}
