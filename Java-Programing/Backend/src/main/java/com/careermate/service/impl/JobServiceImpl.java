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
        // simple: return non-deleted jobs
        return jobRepository.findAll().stream()
                .filter(j -> !j.isDeleted())
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
        int page = params.page() == null || params.page() < 0 ? 0 : params.page();
        int size = params.size() == null || params.size() <= 0 ? 10 : params.size();

        Pageable pageable = PageRequest.of(page, size);

        // No complex spec for now: in-memory filtering to keep scaffold runnable.
        // In production replace with QueryDSL/Specifications.
        List<JobEntity> all = jobRepository.findAll().stream()
                .filter(j -> !j.isDeleted())
                .toList();

        List<JobEntity> filtered = all.stream().filter(j -> {
            boolean ok = true;
            if (params.keyword() != null && !params.keyword().isBlank()) {
                String kw = params.keyword().toLowerCase();
                ok &= (j.getTitle() != null && j.getTitle().toLowerCase().contains(kw))
                        || (j.getDescription() != null && j.getDescription().toLowerCase().contains(kw));
            }
            if (params.location() != null && !params.location().isBlank()) {
                ok &= j.getLocation() != null
                        && j.getLocation().toLowerCase().contains(params.location().toLowerCase());
            }
            if (params.minSalary() != null) {
                ok &= j.getMinSalary() != null
                        && j.getMinSalary().compareTo(BigDecimal.valueOf(params.minSalary())) >= 0;
            }
            if (params.maxSalary() != null) {
                ok &= j.getMaxSalary() != null
                        && j.getMaxSalary().compareTo(BigDecimal.valueOf(params.maxSalary())) <= 0;
            }
            if (params.experience() != null && !params.experience().isBlank()) {
                ok &= Objects.equals(j.getExperience(), params.experience());
            }
            if (params.employmentType() != null && !params.employmentType().isBlank()) {
                ok &= Objects.equals(j.getEmploymentType(), params.employmentType());
            }
            if (params.skills() != null && !params.skills().isBlank()) {
                String s = params.skills().toLowerCase();
                ok &= j.getSkills() != null && j.getSkills().toLowerCase().contains(s);
            }
            if (params.companyName() != null && !params.companyName().isBlank()) {
                ok &= j.getRecruiter() != null && j.getRecruiter().getCompanyName() != null
                        && j.getRecruiter().getCompanyName().toLowerCase().contains(params.companyName().toLowerCase());
            }
            return ok;
        }).toList();

        int total = filtered.size();
        int from = Math.min(page * size, total);
        int to = Math.min(from + size, total);
        List<JobEntity> pageItems = filtered.subList(from, to);

        List<JobResponseDto> dtos = pageItems.stream().map(this::toDto).toList();

        return new PageResponseDto<>(
                dtos,
                page,
                size,
                total,
                total == 0 ? 0 : (int) Math.ceil((double) total / size),
                to < total,
                from > 0);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getTrendingJobs() {
        return jobRepository.findTop20ByDeletedFalseAndPremiumTrueOrderByViewCountDesc().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getTrendingKeywords() {
        return jobRepository.findTop20ByDeletedFalseAndPremiumTrueOrderByViewCountDesc().stream()
                .map(JobEntity::getSkills)
                .filter(Objects::nonNull)
                .flatMap(s -> List.of(s.split(","))
                        .stream()
                        .map(String::trim)
                        .filter(t -> !t.isBlank()))
                .distinct()
                .limit(10)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSearchSuggestions(String prefix) {
        String p = prefix == null ? "" : prefix.trim().toLowerCase();
        return jobRepository.findAll().stream()
                .filter(j -> !j.isDeleted())
                .map(JobEntity::getTitle)
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .filter(t -> t.startsWith(p))
                .distinct()
                .limit(8)
                .toList();
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
                .orElseThrow(() -> new EntityNotFoundException("Job not found: " + jobId));

        SavedJobEntity saved = savedJobRepository.findByUser_IdAndJob_Id(userId, jobId).orElse(null);
        if (saved != null) {
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

        if (applicationRepository.existsByCandidate_IdAndJob_Id(candidateId, payload.jobId())) {
            // already applied
            return new Object();
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

        // fallback: token subject stored as username by filter
        return auth.getName();
    }

    private JobResponseDto toDto(JobEntity job) {
        String recruiterId = job.getRecruiter() != null ? job.getRecruiter().getId() : null;
        String companyName = job.getRecruiter() != null ? job.getRecruiter().getCompanyName() : null;

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
                job.getSkills(),
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
