package com.careermate.controller;

import com.careermate.dto.auth.AuthResponse;
import com.careermate.dto.auth.LoginRequest;
import com.careermate.dto.auth.RegisterRequest;
import com.careermate.exception.model.ErrorResponse;
import com.careermate.model.ApiResponse;
import com.careermate.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication REST controller.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse resp = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("success", resp));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse resp = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("success", resp));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh() {
        // Frontend expects { accessToken } at least.
        // Current scaffold does not implement refresh tokens.
        throw new UnsupportedOperationException("Refresh token not implemented");
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> google(@RequestBody Map<String, Object> payload) {
        AuthResponse resp = authService.googleLogin(payload);
        return ResponseEntity.ok(ApiResponse.ok("success", resp));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody Map<String, Object> payload) {
        authService.resetPassword(payload);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }
}
