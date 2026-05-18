package com.careermate.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * VIP plan definition.
 */
@Getter
@Setter
@Entity
@Table(name = "vip_plans")
public class VipPlanEntity {

    @Id
    @Column(name = "id", length = 50)
    private String id; // e.g. free, monthly, yearly

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "duration", nullable = false, length = 20)
    private String duration; // MONTHLY | YEARLY

    @Column(name = "features", columnDefinition = "TEXT")
    private String features;

    @Column(name = "recommended")
    private boolean recommended;
}
