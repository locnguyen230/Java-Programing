package com.careermate.repository;

import com.careermate.entity.SavedJobEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJobEntity, String> {

    Optional<SavedJobEntity> findByUser_IdAndJob_Id(String userId, String jobId);

    Page<SavedJobEntity> findAllByUser_Id(String userId, Pageable pageable);
}
