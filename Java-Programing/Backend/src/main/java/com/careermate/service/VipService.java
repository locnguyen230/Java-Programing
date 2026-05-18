package com.careermate.service;

import com.careermate.dto.vip.MySubscriptionDto;
import com.careermate.dto.vip.PlanDto;

import java.util.List;

/**
 * VIP plan & subscription business logic.
 */
public interface VipService {

    List<PlanDto> getPlans();

    MySubscriptionDto getMySubscription();
}
