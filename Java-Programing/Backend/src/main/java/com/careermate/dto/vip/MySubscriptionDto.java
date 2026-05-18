package com.careermate.dto.vip;

import java.time.Instant;

/** Current subscription payload. */
public record MySubscriptionDto(
        String vipType,
        Instant expireDate) {
}
