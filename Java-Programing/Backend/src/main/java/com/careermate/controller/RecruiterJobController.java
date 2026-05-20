package com.careermate.controller;

import com.careermate.dto.recruiter.EmployerApplicantDto;
import com.careermate.dto.recruiter.EmployerJobDto;
import com.careermate.model.ApiResponse;
import com.careermate.service.RecruiterJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Recruiter endpoints.
 */
@RestController
@RequestMapping("/api/jobs/employer")
@RequiredArgsConstructor
public class RecruiterJobController {

    private final RecruiterJobService recruiterJobService;

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<EmployerJobDto>>> getEmployerJobs() {
        return ResponseEntity.ok(ApiResponse.ok("success", recruiterJobService.getEmployerJobs()));
    }

    // lay danh sach ung vien da apply vao 1 job cua nha tuyen dung
    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<ApiResponse<List<EmployerApplicantDto>>> getJobApplicants(@PathVariable String jobId) {
        return ResponseEntity.ok(ApiResponse.ok("success", recruiterJobService.getJobApplicants(jobId)));
    }

    // chap nhan ung vien da apply vao job cua nha tuyen dung
    @PostMapping("/applications/{applicationId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptApplication(@PathVariable String applicationId) {
        recruiterJobService.acceptApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    // tu choi ung vien da apply vao job cua nha tuyen dung
    @PostMapping("/applications/{applicationId}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectApplication(@PathVariable String applicationId) {
        recruiterJobService.rejectApplication(applicationId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    // tao job moi cua nha tuyen dung
    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<EmployerJobDto>> createEmployerJob(@RequestBody Object payload) {
        return ResponseEntity.ok(ApiResponse.ok("success", recruiterJobService.createEmployerJob(payload)));
    }

    // dang tin tuyen dung cua nha tuyen dung len he thong
    @PostMapping("/jobs/{jobId}/publish")
    public ResponseEntity<ApiResponse<Void>> publishEmployerJob(@PathVariable String jobId) {
        recruiterJobService.publishEmployerJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }
}
