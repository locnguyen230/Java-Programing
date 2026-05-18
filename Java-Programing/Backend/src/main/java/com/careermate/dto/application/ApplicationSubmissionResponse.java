package com.careermate.dto.application;

/** Candidate apply response payload. */
public record ApplicationSubmissionResponse(
                boolean success,
                String message,
                String applicationId,
                String status) {
}
