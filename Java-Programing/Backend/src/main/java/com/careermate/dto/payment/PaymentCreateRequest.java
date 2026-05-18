package com.careermate.dto.payment;

import jakarta.validation.constraints.NotBlank;

public record PaymentCreateRequest(@NotBlank String planId) {
}
