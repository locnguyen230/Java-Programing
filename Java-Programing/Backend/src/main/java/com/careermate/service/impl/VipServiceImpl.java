package com.careermate.service.impl;

import com.careermate.dto.vip.MySubscriptionDto;
import com.careermate.dto.vip.PlanDto;
import com.careermate.security.CurrentUser;
import com.careermate.service.VipService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Stub VIP service.
 */
@Slf4j
@Service
public class VipServiceImpl implements VipService {

        @Override
        public List<PlanDto> getPlans() {
                return List.of(
                                new PlanDto("free", "Free", java.math.BigDecimal.ZERO, "MONTHLY",
                                                List.of("Basic access", "Standard jobs"), false),
                                new PlanDto("vip_monthly", "VIP Monthly", new java.math.BigDecimal("9.99"), "MONTHLY",
                                                List.of("AI unlimited", "Priority access"),
                                                true),
                                new PlanDto("vip_yearly", "VIP Yearly", new java.math.BigDecimal("99.0"), "YEARLY",
                                                List.of("AI unlimited", "Priority access"),
                                                true));

        }

        @Override
        public MySubscriptionDto getMySubscription() {
                // scaffold: if user exists, return active for now
                String userId = CurrentUser.id();
                log.info("getMySubscription stub userId={}", userId);

                return new MySubscriptionDto(
                                "VIP_MONTHLY",
                                Instant.now().plusSeconds(60L * 60 * 24 * 30));

        }
}
