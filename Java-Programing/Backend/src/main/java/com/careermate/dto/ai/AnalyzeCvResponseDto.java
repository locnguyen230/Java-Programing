package com.careermate.dto.ai;

import java.util.List;

/**
 * Response payload for /api/ai/analyze-cv.
 */
public record AnalyzeCvResponseDto(
                String summary,
                Integer score,
                List<String> skills,
                List<String> strengths,
                List<String> improvements) {
}
