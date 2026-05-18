package com.careermate.controller;

import com.careermate.dto.application.ApplicationSubmissionRequest;
import com.careermate.dto.job.JobResponseDto;
import com.careermate.dto.job.JobSearchParamsDto;
import com.careermate.dto.job.PageResponseDto;
import com.careermate.model.ApiResponse;
import com.careermate.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Candidate jobs REST controller.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponseDto>>> getJobs() {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getJobs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponseDto>> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getJobById(id)));
    }

    @GetMapping("/search/advanced")
    public ResponseEntity<ApiResponse<PageResponseDto<JobResponseDto>>> searchAdvanced(
            @Valid JobSearchParamsDto params) {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.searchAdvanced(params)));
    }

    @GetMapping("/trending/list")
    public ResponseEntity<ApiResponse<List<JobResponseDto>>> getTrendingJobs() {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getTrendingJobs()));
    }

    @GetMapping("/search/trending")
    public ResponseEntity<ApiResponse<List<String>>> getTrendingKeywords() {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getTrendingKeywords()));
    }

    @GetMapping("/search/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(@RequestParam String prefix) {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getSearchSuggestions(prefix)));
    }

    @GetMapping("/search/recent")
    public ResponseEntity<ApiResponse<List<String>>> getRecentSearches() {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getRecentSearches()));
    }

    @PostMapping("/{jobId}/save")
    public ResponseEntity<ApiResponse<Void>> saveJob(@PathVariable String jobId) {
        jobService.saveJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @DeleteMapping("/{jobId}/save")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(@PathVariable String jobId) {
        jobService.unsaveJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @GetMapping("/saved/list")
    public ResponseEntity<ApiResponse<PageResponseDto<JobResponseDto>>> getSavedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok("success", jobService.getSavedJobs(page, size)));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<Object>> applyJob(@PathVariable("id") String jobId,
            @Valid @RequestBody ApplicationSubmissionRequest payload) {
        // Frontend posts payload with jobId also. We keep path as source of truth.
        payload = new ApplicationSubmissionRequest(
                payload.fullName(),
                payload.email(),
                payload.phoneNumber(),
                payload.cvUrl(),
                payload.coverLetter(),
                jobId);

        return ResponseEntity.ok(ApiResponse.ok("success", jobService.applyJob(payload)));
    }
}
