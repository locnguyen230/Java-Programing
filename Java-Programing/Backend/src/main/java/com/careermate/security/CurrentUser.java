package com.careermate.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Helper to get current user's identity from SecurityContext.
 */
public final class CurrentUser {

    private CurrentUser() {
    }

    /**
     * @return current authenticated user id.
     */
    public static String id() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authentication in context");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof SecurityUserDetails sud) {
            return sud.id();
        }

        return auth.getName();
    }
}
