package com.careermate.security;

/**
 * JWT principal representation.
 */
public record SecurityUserDetails(String id, String email, String name, String role) {
}
