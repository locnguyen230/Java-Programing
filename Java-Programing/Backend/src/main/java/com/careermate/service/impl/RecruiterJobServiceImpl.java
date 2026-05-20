package com.careermate.service.impl;

import com.careermate.dto.recruiter.EmployerApplicantDto;
import com.careermate.dto.recruiter.EmployerJobDto;
import com.careermate.entity.ApplicationEntity;
import com.careermate.entity.JobEntity;
import com.careermate.entity.NotificationEntity;
import com.careermate.entity.UserEntity;
import com.careermate.repository.ApplicationRepository;
import com.careermate.repository.JobRepository;
import com.careermate.repository.UserRepository;
import com.careermate.repository.NotificationRepository;
import com.careermate.service.RecruiterJobService;
import com.careermate.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.careermate.entity.SkillEntity;
import com.careermate.repository.SkillRepository;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.processing.SupportedSourceVersion;

/**
 * Default recruiter service implementation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecruiterJobServiceImpl implements RecruiterJobService {

    private final NotificationRepository notificationRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EmployerJobDto> getEmployerJobs() {
        String recruiterId = CurrentUser.id();
        // Chỉ lấy job của đúng recruiter đó từ DB
        return jobRepository.findByRecruiterIdAndDeletedFalse(recruiterId).stream()
                .map(j -> new EmployerJobDto(j.getId(), j.getTitle(),
                        j.getStatus() != null ? j.getStatus().name() : null, j.isDeleted()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployerApplicantDto> getJobApplicants(String jobId) {
        String recruiterId = CurrentUser.id();

        // Lấy danh sách ứng viên chỉ khi job đó thuộc về recruiter đang đăng nhập
        List<ApplicationEntity> applicants = jobRepository.findByJobIdAndRecruiterId(jobId, recruiterId);

        // Nếu danh sách rỗng, có thể là jobId sai hoặc không phải job của người đó
        if (applicants.isEmpty()) {
            // Kiểm tra xem job có tồn tại không để ném Exception phù hợp (404 hoặc 403)
            if (!jobRepository.existsById(jobId))
                throw new EntityNotFoundException("Job not found");
        }

        return applicants.stream()
                .map(ap -> this.toDto(ap))
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void acceptApplication(String applicationId) {
        try {
            // 1. Lấy thông tin đơn và Job đi kèm (nên dùng JOIN FETCH nếu cần)
            ApplicationEntity app = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Application not found"));

            JobEntity job = app.getJob();

            // 2. Kiểm tra logic nghiệp vụ trước khi lưu
            if (app.getStatus() != ApplicationEntity.ApplicationStatus.SUBMITTED) {
                throw new IllegalStateException("The application is not in a submittable state.");
            }

            if (job.getQuantity() <= 0) {
                throw new IllegalStateException("The job has no available positions.");
            }

            NotificationEntity notification = createNofication(app, "Congratulations on your application!");

            // 3. Thực hiện thay đổi
            app.setStatus(ApplicationEntity.ApplicationStatus.ACCEPTED);
            job.setQuantity(job.getQuantity() - 1);

            // 4. Lưu lại
            notificationRepository.save(notification);
            applicationRepository.save(app);
            jobRepository.save(job);

        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("The data has been changed by another user. Please reload the page.");
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void rejectApplication(String applicationId) {
        try {
            // 1. Lấy thông tin đơn và Job đi kèm (nên dùng JOIN FETCH nếu cần)
            ApplicationEntity app = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new IllegalArgumentException("Application not found"));

            JobEntity job = app.getJob();

            // 2. Kiểm tra logic nghiệp vụ trước khi lưu
            if (app.getStatus() != ApplicationEntity.ApplicationStatus.SUBMITTED) {
                throw new IllegalStateException("This application is not pending.");
            }

            NotificationEntity notification = createNofication(app, "Unfortunately, you haven't been selected!");

            // 3. Thực hiện thay đổi
            app.setStatus(ApplicationEntity.ApplicationStatus.REJECTED);

            // 4. Lưu lại
            notificationRepository.save(notification);
            applicationRepository.save(app);

        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("The data has been changed by another user. Please reload the page.");
        }
    }

    public NotificationEntity createNofication(ApplicationEntity app, String msg) {
        NotificationEntity notification = new NotificationEntity();
        notification.setCandidate(app.getCandidate());
        notification.setMessage(msg);
        return notification;
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
        job.setBenefits(asString(map, "benefits"));
        // JobEntity hiện không có field tags trong entity
        job.setCategory(asString(map, "category"));
        job.setWorkMode(asString(map, "workMode"));
        job.setLocation(asString(map, "location"));
        job.setExperience(asString(map, "experience"));
        job.setEmploymentType(asString(map, "employmentType"));
        job.setDeadline(asString(map, "deadline"));

        job.setFeatured(Boolean.TRUE.equals(map.get("featured")));
        if (map.get("quantity") instanceof Number n) {
            if (n.intValue() < 0) {
                throw new IllegalArgumentException("Quantity cannot be negative");
            }
            job.setQuantity(n.intValue());
        }

        if (map.get("skills") instanceof List<?> skillNames) {
            Set<SkillEntity> skillEntities = skillNames.stream()
                    .map(obj -> obj != null ? obj.toString().trim() : "")
                    .filter(name -> !name.isEmpty())
                    .map(name -> skillRepository.findByName(name)
                            .orElseGet(() -> {
                                SkillEntity newSkill = new SkillEntity();
                                newSkill.setName(name);
                                return skillRepository.save(newSkill);
                            }))
                    .collect(Collectors.toSet());
            job.setSkills(skillEntities);
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

        Number minSalaryObj = map.get("minSalary") instanceof Number nMin ? nMin : null;
        Number maxSalaryObj = map.get("maxSalary") instanceof Number nMax ? nMax : null;

        if (minSalaryObj != null) {
            job.setMinSalary(new java.math.BigDecimal(minSalaryObj.toString()));
        }
        if (maxSalaryObj != null) {
            job.setMaxSalary(new java.math.BigDecimal(maxSalaryObj.toString()));
        }
        if (minSalaryObj != null && maxSalaryObj != null
                && new java.math.BigDecimal(minSalaryObj.toString())
                        .compareTo(new java.math.BigDecimal(maxSalaryObj.toString())) > 0) {
            throw new IllegalArgumentException("Min salary cannot be greater than max salary");
        }
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
