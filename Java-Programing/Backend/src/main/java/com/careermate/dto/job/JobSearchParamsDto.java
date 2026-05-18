package com.careermate.dto.job;

import jakarta.validation.constraints.Min;

/** Advanced search params. */
public record JobSearchParamsDto(
                String keyword,
                String location,
                @Min(0) Integer minSalary,
                @Min(0) Integer maxSalary,
                String experience,
                String employmentType,
                String skills,
                String companyName,
                Integer page,
                Integer size,
                String sortBy,
                String sortOrder) {
}
