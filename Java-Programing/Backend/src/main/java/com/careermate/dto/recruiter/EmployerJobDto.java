package com.careermate.dto.recruiter;

/**
 * Recruiter-facing job list payload.
 */
public record EmployerJobDto(
                String id,
                String title,
                String status,
                boolean deleted) {
}
