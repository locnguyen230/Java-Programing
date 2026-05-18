package com.careermate.repository;

import com.careermate.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, String> {

    List<JobEntity> findTop20ByDeletedFalseAndPremiumTrueOrderByViewCountDesc();
}
