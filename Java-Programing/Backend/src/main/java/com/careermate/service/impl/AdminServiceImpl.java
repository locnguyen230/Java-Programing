package com.careermate.service.impl;

import com.careermate.dto.admin.AdminStatsDto;
import com.careermate.dto.admin.AdminUserDto;
import com.careermate.dto.job.JobResponseDto;
import com.careermate.entity.JobEntity;
import com.careermate.entity.UserEntity;
import com.careermate.repository.JobRepository;
import com.careermate.repository.UserRepository;
import com.careermate.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Scaffold admin implementation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        long totalUsers = userRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = 0L;
        return new AdminStatsDto(totalUsers, totalJobs, totalApplications);

    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::toJobDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void approveJob(String id) {
        JobEntity job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        job.setStatus(JobEntity.JobStatus.PUBLISHED);
        jobRepository.save(job);
    }

    private AdminUserDto toDto(UserEntity u) {
        return new AdminUserDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole() != null ? u.getRole().name() : null,
                u.getStatus() != null ? u.getStatus().name() : null);
    }

    private JobResponseDto toJobDto(JobEntity j) {
        // Reuse existing JobResponseDto shape with minimal fields.
        return new JobResponseDto(
                j.getId(),
                j.getTitle(),
                j.getDescription(),
                j.getRequirements(),
                j.getMinSalary(),
                j.getMaxSalary(),
                j.getSalaryUnit(),
                j.getLocation(),
                j.getExperience(),
                j.getEmploymentType(),
                j.getSkills(),
                j.getCreatedAt() != null ? j.getCreatedAt().toString() : null,
                j.getDeadline(),
                j.getViewCount(),
                0L,
                null,
                false,
                j.isPremium(),
                j.isPremium() ? "secondary" : "primary");
    }
}
