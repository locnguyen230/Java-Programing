package com.careermate.dto.job;

import java.math.BigDecimal;

/** Job response payload used by frontend. */
public record JobResponseDto(
        String id,
        String title,
        String description,
        String requirements,
        BigDecimal minSalary,
        BigDecimal maxSalary,
        String salaryUnit,
        String location,
        String experience,
        String employmentType,
        String skills,
        String createdAt,
        String deadline,
        long viewCount,
        long applicantCount,
        CompanyDto company,
        boolean isSaved,
        boolean isPremium,
        String logoColor) {

    public record CompanyDto(String id, String name, String description, String logoUrl) {
    }
}
