package com.careermate.dto.vip;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.util.List;

/** VIP plan payload. */
public record PlanDto(
                String id,
                String name,
                BigDecimal price,
                String duration,
                List<String> features,
                @JsonInclude(JsonInclude.Include.NON_NULL) Boolean recommended) {
}
