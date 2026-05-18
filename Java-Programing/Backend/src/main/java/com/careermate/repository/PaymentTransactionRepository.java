package com.careermate.repository;

import com.careermate.entity.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, String> {

    Optional<PaymentTransactionEntity> findByTransactionId(String transactionId);
}
