package com.careermate.service;

import com.careermate.dto.admin.AdminStatsDto;
import com.careermate.dto.admin.AdminUserDto;
import com.careermate.dto.job.JobResponseDto;

import java.util.List;

/**
 * Admin business logic.
 */
public interface AdminService {

    AdminStatsDto getStats();

    List<AdminUserDto> getAllUsers();

    List<JobResponseDto> getAllJobs();

    void deleteUser(String id);

    void approveJob(String id);
}
