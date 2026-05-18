package com.careermate.service.impl;

import com.careermate.dto.payment.PaymentCreateRequest;
import com.careermate.dto.payment.PaymentCreateResponse;
import com.careermate.security.CurrentUser;
import com.careermate.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Stub payment service to satisfy frontend.
 */
@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    @Override
    public PaymentCreateResponse create(PaymentCreateRequest request) {
        String userId = CurrentUser.id();
        log.info("payment create stub userId={} planId={}", userId, request != null ? request.planId() : null);

        String transactionId = UUID.randomUUID().toString();
        return new PaymentCreateResponse(
                transactionId,
                "https://example.com/qr/" + transactionId,
                new java.math.BigDecimal(request != null ? "9.99" : "9.99"),
                "546",
                "000123456789",
                "careermate");

    }

    @Override
    public void confirm(String transactionId, String paymentId) {
        log.info("payment confirm stub transactionId={} paymentId={}", transactionId, paymentId);
    }

    @Override
    public void webhook(String transactionId) {
        log.info("payment webhook stub transactionId={}", transactionId);
    }

    @Override
    public Object getStatus(String transactionId) {
        log.info("payment status stub transactionId={}", transactionId);
        Map<String, Object> status = new HashMap<>();
        status.put("transactionId", transactionId);
        status.put("status", "SUCCESS");
        return status;
    }
}
