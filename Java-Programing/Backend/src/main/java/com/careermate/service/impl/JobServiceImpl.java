package com.careermate.service.impl;

import com.careermate.dto.application.ApplicationSubmissionRequest;
import com.careermate.dto.job.JobResponseDto;
import com.careermate.dto.job.JobSearchParamsDto;
import com.careermate.dto.job.PageResponseDto;
import com.careermate.entity.ApplicationEntity;
import com.careermate.entity.ApplicationEntity.ApplicationStatus;
import com.careermate.entity.JobEntity;
import com.careermate.entity.SavedJobEntity;
import com.careermate.entity.UserEntity;
import com.careermate.repository.ApplicationRepository;
import com.careermate.repository.JobRepository;
import com.careermate.repository.SavedJobRepository;
import com.careermate.repository.UserRepository;
import com.careermate.security.SecurityUserDetails;
import com.careermate.service.JobService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.java.com.careermate.entity.SkillEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Candidate jobs service implementation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getJobs() {
        Pageable pageable = PageRequest.of(0, 50);

        return jobRepository.findAllOptimized(pageable)
                .getContent()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDto getJobById(String id) {
        JobEntity job = jobRepository.findById(id)
                .filter(j -> !j.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + id));
        return toDto(job);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<JobResponseDto> searchAdvanced(JobSearchParamsDto params) {
        // 1. Chuẩn bị Pageable
        int page = params.page() == null || params.page() < 0 ? 0 : params.page();
        int size = params.size() == null || params.size() <= 0 ? 10 : params.size();
        Pageable pageable = PageRequest.of(page, size);

        // 2. Gọi Repository để lấy dữ liệu đã được lọc và phân trang từ DB
        Page<JobEntity> jobPage = jobRepository.searchJobs(
                params.keyword(),
                params.location(),
                params.minSalary(),
                params.maxSalary(),
                params.experience(),
                params.employmentType(),
                params.companyName(),
                params.skills(),
                pageable);

        // 3. Chuyển đổi sang DTO
        List<JobResponseDto> dtos = jobPage.getContent().stream()
                .map(this::toDto)
                .toList();

        // 4. Trả về kết quả phân trang chuẩn từ Spring Data
        return new PageResponseDto<>(
                dtos,
                jobPage.getNumber(),
                jobPage.getSize(),
                jobPage.getTotalElements(),
                jobPage.getTotalPages(),
                jobPage.hasNext(),
                jobPage.hasPrevious());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getTrendingJobs() {
        return jobRepository.findTop20ByDeletedFalseAndPremiumTrueOrderByViewCountDesc().stream()
                .map(job -> this.toDto(job))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getTrendingKeywords() {
        return jobRepository.findTopTrendingKeywords(PageRequest.of(0, 10));
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSearchSuggestions(String prefix) {
        // 1. Xử lý chuỗi prefix an toàn
        String p = (prefix == null || prefix.isBlank()) ? "" : prefix.trim();

        // 2. Chỉ lấy tối đa 8 kết quả
        Pageable pageable = PageRequest.of(0, 8);

        // 3. Gọi trực tiếp Database
        return jobRepository.findTitlesByPrefix(p, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getRecentSearches() {
        // scaffold: static
        return List.of("react", "java", "spring boot");
    }

    @Override
    @Transactional
    public void saveJob(String jobId) {
        String userId = currentUserId();
        JobEntity job = jobRepository.findById(jobId)
                .filter(j -> !j.isDeleted() && j.getQuantity() > 0)
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + jobId));
        SavedJobEntity saved = savedJobRepository.findByUser_IdAndJob_Id(userId, jobId).orElse(null);
        if (saved != null) {
            throw new IllegalStateException("Job already saved");
            return;
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));

        SavedJobEntity entity = new SavedJobEntity();
        entity.setUser(user);
        entity.setJob(job);
        savedJobRepository.save(entity);
    }

    @Override
    @Transactional
    public void unsaveJob(String jobId) {
        String userId = currentUserId();
        SavedJobEntity saved = savedJobRepository.findByUser_IdAndJob_Id(userId, jobId)
                .orElseThrow(() -> new EntityNotFoundException("Saved job not found"));
        savedJobRepository.delete(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponseDto<JobResponseDto> getSavedJobs(int page, int size) {
        String userId = currentUserId();
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));

        Page<SavedJobEntity> pageResult = savedJobRepository.findAllByUser_Id(userId, pageable);
        List<JobResponseDto> items = pageResult.getContent().stream()
                .map(s -> toDto(s.getJob()))
                .toList();

        return new PageResponseDto<>(
                items,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.hasNext(),
                pageResult.hasPrevious());
    }

    @Override
    @Transactional
    public Object applyJob(ApplicationSubmissionRequest payload) {
        String candidateId = currentUserId();

        JobEntity job = jobRepository.findById(payload.jobId())
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + payload.jobId()));

        if (job.isDeleted() || job.getQuantity() <= 0) {
            throw new IllegalStateException("Job is not available for application");
        }

        if (applicationRepository.existsByCandidate_IdAndJob_Id(candidateId, payload.jobId())) {
            // already applied: return consistent response shape
            return new com.careermate.dto.application.ApplicationSubmissionResponse(
                    false,
                    "Already applied",
                    null,
                    ApplicationEntity.ApplicationStatus.SUBMITTED.name());
        }

        UserEntity candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + candidateId));

        ApplicationEntity application = new ApplicationEntity();
        application.setCandidate(candidate);
        application.setJob(job);
        application.setFullName(payload.fullName());
        application.setEmail(payload.email());
        application.setPhoneNumber(payload.phoneNumber());
        application.setCvUrl(payload.cvUrl());
        application.setCoverLetter(payload.coverLetter());
        application.setStatus(ApplicationStatus.SUBMITTED);

        ApplicationEntity saved = applicationRepository.save(application);

        return new com.careermate.dto.application.ApplicationSubmissionResponse(
                true,
                "Applied successfully",
                saved.getId(),
                saved.getStatus().name());
    }

    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new IllegalStateException("No authentication in context");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof com.careermate.security.SecurityUserDetails sud) {
            return sud.id();
        }

        // fallback: best-effort subject from JWT name
        // If auth.getPrincipal() is not our SecurityUserDetails, we assume
        // auth.getName() is JWT subject.
        return auth.getName();
    }

    private JobResponseDto toDto(JobEntity job) {
        String recruiterId = job.getRecruiter() != null ? job.getRecruiter().getId() : null;
        String companyName = job.getRecruiter() != null ? job.getRecruiter().getCompanyName() : null;

        String skills = job.getSkills() != null
                ? job.getSkills().stream()
                        .map(SkillEntity::getName)
                        .collect(Collectors.joining(", "))
                : "";

        boolean isPremium = job.isPremium();

        String logoColor = isPremium ? "secondary" : "primary";

        return new JobResponseDto(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getRequirements(),
                job.getMinSalary(),
                job.getMaxSalary(),
                job.getSalaryUnit(),
                job.getLocation(),
                job.getExperience(),
                job.getEmploymentType(),
                skills,
                job.getCreatedAt() != null ? job.getCreatedAt().toString() : null,
                job.getDeadline(),
                job.getViewCount(),
                0L,
                job.getRecruiter() == null ? null : new JobResponseDto.CompanyDto(recruiterId, companyName, null, null),
                false,
                isPremium,
                logoColor);
    }
}
