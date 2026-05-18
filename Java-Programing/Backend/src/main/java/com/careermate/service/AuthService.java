package com.careermate.service;

import com.careermate.dto.auth.AuthResponse;
import com.careermate.dto.auth.LoginRequest;
import com.careermate.dto.auth.RegisterRequest;

/**
 * Auth business operations.
 */
public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    /**
     * Logout is stateless for JWT. Kept for frontend contract.
     */
    void logout();

    /**
     * Refresh token is not implemented (no refresh token storage in this scaffold).
     * Kept for frontend contract.
     */
    AuthResponse refresh();

    void forgotPassword(String email);

    void resetPassword(Object payload);

    AuthResponse googleLogin(Object payload);
}
