package com.careermate.dto.user;

import com.careermate.entity.UserEntity;

/** Minimal user info used by frontend. */
public record UserResponseDto(
                String id,
                String email,
                String name,
                UserEntity.UserRole role,
                String status,
                String companyName) {
}
