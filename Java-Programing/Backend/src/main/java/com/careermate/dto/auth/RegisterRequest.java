package com.careermate.dto.auth;

import com.careermate.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Register request payload. */
public record RegisterRequest(
                @NotBlank String fullName,
                @Email @NotBlank String email,
                @Size(min = 8) String password,
                @NotBlank String confirmPassword,
                @NotNull UserEntity.UserRole role,
                String companyName) {
}
