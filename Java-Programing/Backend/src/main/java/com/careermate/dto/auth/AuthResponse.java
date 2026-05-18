package com.careermate.dto.auth;

import com.careermate.dto.user.UserResponseDto;

/** Auth response wrapper payload. */
public record AuthResponse(
        UserResponseDto user,
        String accessToken) {
}
