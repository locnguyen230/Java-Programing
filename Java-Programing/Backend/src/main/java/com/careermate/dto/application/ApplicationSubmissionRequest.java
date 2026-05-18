package com.careermate.dto.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Candidate apply request payload. */
public record ApplicationSubmissionRequest(
                @NotBlank String fullName,
                @Email @NotBlank String email,
                @NotBlank String phoneNumber,
                @NotBlank String cvUrl,
                String coverLetter,
                @NotBlank String jobId) {
}
