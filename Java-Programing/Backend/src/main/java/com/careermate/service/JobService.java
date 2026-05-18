package com.careermate.service;

import com.careermate.dto.application.ApplicationSubmissionRequest;
import com.careermate.dto.job.JobResponseDto;
import com.careermate.dto.job.JobSearchParamsDto;
import com.careermate.dto.job.PageResponseDto;

import java.util.List;

/**
 * Business logic for candidate jobs.
 */
public interface JobService {

    List<JobResponseDto> getJobs();

    JobResponseDto getJobById(String id);

    PageResponseDto<JobResponseDto> searchAdvanced(JobSearchParamsDto params);

    List<JobResponseDto> getTrendingJobs();

    List<String> getTrendingKeywords();

    List<String> getSearchSuggestions(String prefix);

    List<String> getRecentSearches();

    void saveJob(String jobId);

    void unsaveJob(String jobId);

    PageResponseDto<JobResponseDto> getSavedJobs(int page, int size);

    Object applyJob(ApplicationSubmissionRequest payload);
}
