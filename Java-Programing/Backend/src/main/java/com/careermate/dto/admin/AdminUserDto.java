package com.careermate.dto.admin;

/**
 * Admin user list payload.
 */
public record AdminUserDto(
                String id,
                String name,
                String email,
                String role,
                String status) {
}
