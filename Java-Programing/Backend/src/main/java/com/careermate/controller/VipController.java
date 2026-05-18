package com.careermate.controller;

import com.careermate.dto.vip.MySubscriptionDto;
import com.careermate.dto.vip.PlanDto;
import com.careermate.model.ApiResponse;
import com.careermate.service.VipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * VIP endpoints.
 */
@RestController
@RequestMapping("/api/vip")
@RequiredArgsConstructor
public class VipController {

    private final VipService vipService;

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<PlanDto>>> plans() {
        return ResponseEntity.ok(ApiResponse.ok("success", vipService.getPlans()));
    }

    @GetMapping("/my-subscription")
    public ResponseEntity<ApiResponse<MySubscriptionDto>> mySubscription() {
        return ResponseEntity.ok(ApiResponse.ok("success", vipService.getMySubscription()));
    }
}
