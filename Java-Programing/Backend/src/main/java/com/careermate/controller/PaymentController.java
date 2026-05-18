package com.careermate.controller;

import com.careermate.dto.payment.PaymentCreateRequest;
import com.careermate.dto.payment.PaymentCreateResponse;
import com.careermate.model.ApiResponse;
import com.careermate.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Payment endpoints.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments/create")
    public ResponseEntity<ApiResponse<PaymentCreateResponse>> create(@RequestBody PaymentCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("success", paymentService.create(request)));
    }

    @PostMapping("/payments/confirm/{transactionId}")
    public ResponseEntity<ApiResponse<Void>> confirm(
            @PathVariable String transactionId,
            @RequestBody(required = false) Object payload) {
        String paymentId = payload instanceof java.util.Map<?, ?> m && m.get("paymentId") != null
                ? m.get("paymentId").toString()
                : null;
        paymentService.confirm(transactionId, paymentId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @PostMapping("/payments/webhook/{transactionId}")
    public ResponseEntity<ApiResponse<Void>> webhook(@PathVariable String transactionId) {
        paymentService.webhook(transactionId);
        return ResponseEntity.ok(ApiResponse.ok("success", null));
    }

    @GetMapping("/payments/{transactionId}")
    public ResponseEntity<ApiResponse<Object>> status(@PathVariable String transactionId) {
        return ResponseEntity.ok(ApiResponse.ok("success", paymentService.getStatus(transactionId)));
    }
}
