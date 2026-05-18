package com.careermate.service;

import com.careermate.dto.recruiter.EmployerApplicantDto;
import com.careermate.dto.recruiter.EmployerJobDto;

import java.util.List;

/**
 * Recruiter job management business logic.
 */
public interface RecruiterJobService {

    List<EmployerJobDto> getEmployerJobs();

    List<EmployerApplicantDto> getJobApplicants(String jobId);

    void acceptApplication(String applicationId);

    void rejectApplication(String applicationId);

    EmployerJobDto createEmployerJob(Object payload);

    void publishEmployerJob(String jobId);
}
