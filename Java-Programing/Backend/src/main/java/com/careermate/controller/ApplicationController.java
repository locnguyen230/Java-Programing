package com.careermate.controller;

import com.careermate.dto.application.ApplicationDetailDto;
import com.careermate.dto.application.NotificationDetailDto;
import com.careermate.model.ApiResponse;
import com.careermate.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Candidate applications & notifications.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/notifications/me")
    public ResponseEntity<ApiResponse<Object>> myNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok("success", applicationService.getMyNotifications(page, size)));
    }

    // lay chi tiet 1 ung dung da apply cua ung vien
    @GetMapping("/notifications/{notificationId}")
    public ResponseEntity<ApiResponse<Object>> notificationDetail(@PathVariable String notificationId) {
        NotificationDetailDto dto = applicationService.getNotificationDetail(notificationId);
        return ResponseEntity.ok(ApiResponse.ok("success", dto));
    }

    // lay danh sach ung vien da apply vao 1 job cua nha tuyen dung
    @GetMapping("/applications/me")
    public ResponseEntity<ApiResponse<Object>> myApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok("success", applicationService.getMyApplications(page, size)));
    }
}
