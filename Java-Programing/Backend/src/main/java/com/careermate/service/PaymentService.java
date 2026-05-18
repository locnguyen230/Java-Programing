package com.careermate.service;

import com.careermate.dto.payment.PaymentCreateRequest;
import com.careermate.dto.payment.PaymentCreateResponse;

/**
 * Payment business logic.
 */
public interface PaymentService {

    PaymentCreateResponse create(PaymentCreateRequest request);

    void confirm(String transactionId, String paymentId);

    void webhook(String transactionId);

    Object getStatus(String transactionId);
}
