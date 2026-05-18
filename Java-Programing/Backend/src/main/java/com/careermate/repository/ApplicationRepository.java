package com.careermate.repository;

import com.careermate.entity.ApplicationEntity;
import com.careermate.entity.ApplicationEntity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, String> {

    Page<ApplicationEntity> findAllByCandidate_Id(String candidateId, Pageable pageable);

    List<ApplicationEntity> findAllByJob_Recruiter_IdAndJob_Id(String recruiterId, String jobId);

    List<ApplicationEntity> findAllByJob_Id(String jobId);

    boolean existsByCandidate_IdAndJob_Id(String candidateId, String jobId);
}
