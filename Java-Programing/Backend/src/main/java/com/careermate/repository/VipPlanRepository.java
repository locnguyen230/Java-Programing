package com.careermate.repository;

import com.careermate.entity.VipPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VipPlanRepository extends JpaRepository<VipPlanEntity, String> {
}
