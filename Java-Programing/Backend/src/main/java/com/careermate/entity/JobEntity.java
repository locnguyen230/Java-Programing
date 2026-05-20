package com.careermate.entity;

import com.careermate.model.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Job posting.
 */
@Getter
@Setter
@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_status_deleted", columnList = "status, deleted"),
        @Index(name = "idx_job_title", columnList = "title"),
        @Index(name = "idx_job_featured_premium", columnList = "featured, premium, view_count")
})
public class JobEntity extends AuditableEntity {

    @Version
    private Long version;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "CHAR(36)")
    private String id;

    @Column(name = "title", nullable = false, length = 300)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "min_salary")
    private BigDecimal minSalary;

    @Column(name = "max_salary")
    private BigDecimal maxSalary;

    @Column(name = "salary_unit", length = 50)
    private String salaryUnit;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "experience", length = 50)
    private String experience;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @ManyToMany
    @JoinTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<SkillEntity> skills = new HashSet<>();

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "work_mode", length = 100)
    private String workMode;

    @Column(name = "deadline")
    private String deadline;

    @Column(name = "featured")
    private boolean featured;

    @Column(name = "quantity")
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private JobStatus status;

    @Column(name = "deleted")
    private boolean deleted;

    @Column(name = "view_count")
    private long viewCount;

    @Column(name = "premium")
    private boolean premium;

    // Recruiter (employer) who owns this job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    private UserEntity recruiter;

    public enum JobStatus {
        DRAFT,
        PUBLISHED,
        ARCHIVED
    }
}
