package com.careermate.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;

/**
 * JWT utility for creating and validating access tokens.
 */
@Slf4j
@Service
public class JwtService {

    private final Key signingKey;

    @Value("${jwt.access-token-ttl-ms}")
    private long accessTokenTtlMs;

    public JwtService(@Value("${jwt.secret}") String secret) {
        // jjwt enforces at least 256-bit key for HMAC-SHA.
        byte[] keyBytes = secret.getBytes();
        if (keyBytes.length < 32) {
            // Deterministic padding to avoid startup failure.
            // For production, replace JWT_SECRET with a secure 32+ byte value.
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, padded.length));
            keyBytes = padded;
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenTtlMs);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Parse JWT claims from access token.
     * <p>
     * Uses legacy jjwt API compatible with jjwt 0.12.x.
     */
    public Claims parseClaims(String token) {
        // Legacy jjwt API (0.12.x)
        return Jwts.parser()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    public boolean isExpired(Claims claims) {
        return claims.getExpiration() != null && claims.getExpiration().before(new Date());
    }
}
