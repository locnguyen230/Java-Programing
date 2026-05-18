package com.careermate.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Login request payload. */
public record LoginRequest(
                @Email @NotBlank String email,
                @NotBlank String password) {
}
