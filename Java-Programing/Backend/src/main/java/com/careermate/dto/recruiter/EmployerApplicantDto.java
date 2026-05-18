package com.careermate.dto.recruiter;

import java.time.Instant;

/**
 * Recruiter-facing candidate applicant payload.
 */
public record EmployerApplicantDto(
                String id,
                String applicationId,
                String status,
                Instant appliedAt,
                String cvUrl,
                String coverLetter,
                String phoneNumber,
                CandidateDto candidate) {

        public record CandidateDto(
                        String userId,
                        String fullName,
                        String email,
                        String phoneNumber) {
        }
}
