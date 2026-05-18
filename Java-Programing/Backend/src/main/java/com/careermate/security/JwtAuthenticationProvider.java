package com.careermate.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

/**
 * Maps JWT claims to a Spring Security auth principal.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationProvider {

    private final JwtService jwtService;

    public JwtAuthContext toContext(Claims claims) {
        String subject = claims.getSubject();
        String role = claims.get("role", String.class);

        Collection<SimpleGrantedAuthority> authorities = role == null
                ? List.of()
                : List.of(new SimpleGrantedAuthority("ROLE_" + role));

        return new JwtAuthContext(subject, role, authorities);
    }
}
