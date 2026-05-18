package com.careermate.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Helper holder for decoded JWT data.
 */
public record JwtAuthContext(String subject, String role, Collection<? extends GrantedAuthority> authorities) {
}
