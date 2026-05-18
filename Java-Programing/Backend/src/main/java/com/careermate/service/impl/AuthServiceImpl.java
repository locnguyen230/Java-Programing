package com.careermate.service.impl;

import com.careermate.dto.auth.AuthResponse;
import com.careermate.dto.auth.LoginRequest;
import com.careermate.dto.auth.RegisterRequest;
import com.careermate.dto.user.UserResponseDto;
import com.careermate.entity.UserEntity;
import com.careermate.repository.UserRepository;
import com.careermate.security.JwtService;
import com.careermate.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Auth implementation using DB user table + JWT.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getStatus() != UserEntity.UserStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is locked");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String role = user.getRole().name();
        String token = jwtService.generateAccessToken(
                user.getId(),
                Map.of("role", role));

        UserResponseDto userDto = new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus().name(),
                user.getCompanyName());

        return new AuthResponse(userDto, token);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        UserEntity user = new UserEntity();
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setCompanyName(request.companyName());
        user.setRole(request.role());
        user.setStatus(UserEntity.UserStatus.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        UserEntity saved = userRepository.save(user);

        String token = jwtService.generateAccessToken(
                saved.getId(),
                Map.of("role", saved.getRole().name()));

        UserResponseDto userDto = new UserResponseDto(
                saved.getId(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getRole(),
                saved.getStatus().name(),
                saved.getCompanyName());

        return new AuthResponse(userDto, token);
    }

    @Override
    public void logout() {
        // Stateless JWT => nothing to do.
        log.info("logout called (stateless)");
    }

    @Override
    public AuthResponse refresh() {
        // No refresh token storage in current scaffold.
        throw new UnsupportedOperationException("Refresh token not implemented");
    }

    @Override
    public void forgotPassword(String email) {
        // Stub: In real world, create reset token and send email.
        userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));
    }

    @Override
    public void resetPassword(Object payload) {
        // Stub: Accept any payload and succeed.
        // For real implementation: verify reset token and update password.
    }

    @Override
    public AuthResponse googleLogin(Object payload) {
        // Stub: treat payload as a map containing email/name.
        // Expected frontend token verification is not implemented in this scaffold.
        String email = extractString(payload, "email");
        String name = extractString(payload, "name");

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Invalid google payload");
        }

        UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
            UserEntity u = new UserEntity();
            u.setEmail(email);
            u.setFullName(name != null ? name : "Google User");
            u.setRole(UserEntity.UserRole.CANDIDATE);
            u.setStatus(UserEntity.UserStatus.ACTIVE);
            // Random password placeholder
            u.setPasswordHash(passwordEncoder.encode("TEMP_PASSWORD"));
            return u;
        });

        UserEntity saved = userRepository.save(user);

        String token = jwtService.generateAccessToken(
                saved.getId(),
                Map.of("role", saved.getRole().name()));

        UserResponseDto userDto = new UserResponseDto(
                saved.getId(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getRole(),
                saved.getStatus().name(),
                saved.getCompanyName());

        return new AuthResponse(userDto, token);
    }

    private String extractString(Object payload, String key) {
        if (!(payload instanceof Map<?, ?> m))
            return null;
        Object v = m.get(key);
        return v != null ? v.toString() : null;
    }
}
