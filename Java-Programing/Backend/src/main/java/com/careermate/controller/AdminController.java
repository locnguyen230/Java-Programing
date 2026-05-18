package com.careermate.controller;

import com.careermate.dto.admin.AdminStatsDto;
import com.careermate.dto.admin.AdminUserDto;
import com.careermate.dto.job.JobResponseDto;
import com.careermate.model.ApiResponse;
import com.careermate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin REST controller.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("success", adminService.getStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserDto>>> users() {
        return ResponseEntity.ok(ApiResponse.ok("success", adminService.getAllUsers()));
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobResponseDto>>> jobs() {
        return ResponseEntity.ok(ApiResponse.ok("success", adminService.getAllJobs()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @PatchMapping("/jobs/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveJob(@PathVariable String id) {
        adminService.approveJob(id);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }
}
