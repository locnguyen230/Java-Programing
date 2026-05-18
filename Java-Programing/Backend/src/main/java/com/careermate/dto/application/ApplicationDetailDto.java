package com.careermate.dto.application;

/** Application detail payload. */
public record ApplicationDetailDto(
                String applicationId,
                String status,
                String appliedAt,
                String cvUrl,
                String coverLetter,
                Object job,
                Object candidate) {
}
