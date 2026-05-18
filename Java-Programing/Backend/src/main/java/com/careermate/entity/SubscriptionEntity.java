package com.careermate.entity;

import com.careermate.model.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * User VIP subscription.
 */
@Getter
@Setter
@Entity
@Table(name = "subscriptions")
public class SubscriptionEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "vip_plan_id", nullable = false, length = 50)
    private String vipPlanId;

    @Column(name = "vip_type", nullable = false, length = 50)
    private String vipType;

    @Column(name = "expire_date")
    private Instant expireDate;
}
