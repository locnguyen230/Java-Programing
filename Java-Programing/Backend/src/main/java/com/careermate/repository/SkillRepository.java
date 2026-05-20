package com.careermate.repository;

import com.careermate.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, String> {

    Optional<SkillEntity> findByName(String name);
}
