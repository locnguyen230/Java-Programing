package com.careermate.service.impl;

import com.careermate.dto.recruiter.EmployerApplicantDto;
import com.careermate.dto.recruiter.EmployerJobDto;
import com.careermate.entity.ApplicationEntity;
import com.careermate.entity.JobEntity;
import com.careermate.entity.UserEntity;
import com.careermate.repository.ApplicationRepository;
import com.careermate.repository.JobRepository;
import com.careermate.repository.UserRepository;
import com.careermate.service.RecruiterJobService;
import com.careermate.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Default recruiter service implementation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecruiterJobServiceImpl implements RecruiterJobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EmployerJobDto> getEmployerJobs() {
        String recruiterId = CurrentUser.id();

        UserEntity recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found"));

        return jobRepository.findAll().stream()
                .filter(j -> !j.isDeleted())
                .filter(j -> j.getRecruiter() != null && recruiterId.equals(j.getRecruiter().getId()))
                .map(j -> new EmployerJobDto(j.getId(), j.getTitle(),
                        j.getStatus() != null ? j.getStatus().name() : null, j.isDeleted()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployerApplicantDto> getJobApplicants(String jobId) {
        String recruiterId = CurrentUser.id();

        // Ensure job belongs to recruiter
        JobEntity job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        if (job.getRecruiter() == null || !recruiterId.equals(job.getRecruiter().getId())) {
            throw new IllegalAccessError("Not your job");
        }

        return applicationRepository.findAllByJob_Id(jobId).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void acceptApplication(String applicationId) {
        ApplicationEntity app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        app.setStatus(ApplicationEntity.ApplicationStatus.ACCEPTED);
        applicationRepository.save(app);
    }

    @Override
    @Transactional
    public void rejectApplication(String applicationId) {
        ApplicationEntity app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        app.setStatus(ApplicationEntity.ApplicationStatus.REJECTED);
        applicationRepository.save(app);
    }

    @Override
    @Transactional
    public EmployerJobDto createEmployerJob(Object payload) {
        // Frontend sends a JSON object payload (typed in TS). For scaffold, accept Map.
        Map<?, ?> map = payload instanceof Map<?, ?> m ? m : Map.of();

        String recruiterId = CurrentUser.id();
        UserEntity recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found"));

        JobEntity job = new JobEntity();
        job.setRecruiter(recruiter);
        job.setDeleted(false);

        job.setTitle(asString(map, "title"));
        job.setDescription(asString(map, "description"));
        job.setRequirements(asString(map, "requirements"));
        job.setSkills(asString(map, "skills"));
        job.setBenefits(asString(map, "benefits"));
        job.setTags(asString(map, "tags"));
        job.setCategory(asString(map, "category"));
        job.setWorkMode(asString(map, "workMode"));
        job.setLocation(asString(map, "location"));
        job.setExperience(asString(map, "experience"));
        job.setEmploymentType(asString(map, "employmentType"));
        job.setDeadline(asString(map, "deadline"));

        job.setFeatured(Boolean.TRUE.equals(map.get("featured")));
        if (map.get("quantity") instanceof Number n) {
            job.setQuantity(n.intValue());
        }

        String statusStr = asString(map, "status");
        if (statusStr != null) {
            try {
                job.setStatus(JobEntity.JobStatus.valueOf(statusStr.toUpperCase()));
            } catch (Exception ignore) {
                job.setStatus(JobEntity.JobStatus.DRAFT);
            }
        } else {
            job.setStatus(JobEntity.JobStatus.DRAFT);
        }

        if (map.get("minSalary") instanceof Number n)
            job.setMinSalary(new java.math.BigDecimal(n.toString()));
        if (map.get("maxSalary") instanceof Number n)
            job.setMaxSalary(new java.math.BigDecimal(n.toString()));
        job.setSalaryUnit(asString(map, "salaryUnit"));

        JobEntity saved = jobRepository.save(job);

        return new EmployerJobDto(saved.getId(), saved.getTitle(),
                saved.getStatus() != null ? saved.getStatus().name() : null, saved.isDeleted());
    }

    @Override
    @Transactional
    public void publishEmployerJob(String jobId) {
        JobEntity job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        String recruiterId = CurrentUser.id();
        if (job.getRecruiter() == null || !recruiterId.equals(job.getRecruiter().getId())) {
            throw new IllegalAccessError("Not your job");
        }

        job.setStatus(JobEntity.JobStatus.PUBLISHED);
        jobRepository.save(job);
    }

    private EmployerApplicantDto toDto(ApplicationEntity a) {
        UserEntity candidate = a.getCandidate();

        EmployerApplicantDto.CandidateDto candidateDto = new EmployerApplicantDto.CandidateDto(
                candidate != null ? candidate.getId() : null,
                candidate != null ? candidate.getFullName() : null,
                candidate != null ? candidate.getEmail() : null,
                candidate != null ? candidate.getCompanyName() : null);

        Instant appliedAt = a.getCreatedAt() != null ? a.getCreatedAt() : null;

        return new EmployerApplicantDto(
                a.getId(),
                a.getId(),
                a.getStatus() != null ? a.getStatus().name() : null,
                appliedAt,
                a.getCvUrl(),
                a.getCoverLetter(),
                a.getPhoneNumber(),
                candidateDto);
    }

    private String asString(Map<?, ?> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }
}
