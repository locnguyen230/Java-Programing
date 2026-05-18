package com.careermate.dto.payment;

import java.math.BigDecimal;

/** Payment create response. */
public record PaymentCreateResponse(
                String transactionId,
                String qrUrl,
                BigDecimal amount,
                String bankBin,
                String accountNumber,
                String accountName) {
}
