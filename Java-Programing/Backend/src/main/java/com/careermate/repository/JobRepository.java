package com.careermate.repository;

import com.careermate.entity.ApplicationEntity;
import com.careermate.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<JobEntity, String> {

    // Lấy Top trending (giữ nguyên logic cũ)
    List<JobEntity> findTop20ByDeletedFalseAndPremiumTrueOrderByViewCountDesc();

    // Tìm gợi ý tiêu đề (tối ưu: chỉ lấy 8 bản ghi từ DB, dùng index title)
    @Query("SELECT DISTINCT j.title FROM JobEntity j WHERE LOWER(j.title) LIKE LOWER(CONCAT(:prefix, '%')) AND j.deleted = false")
    List<String> findTitlesByPrefix(@Param("prefix") String prefix, Pageable pageable);

    // Hàm tìm kiếm nâng cao (Tối ưu hóa: xử lý lọc động + JOIN FETCH giải quyết
    // N+1)
    @Query(value = "SELECT DISTINCT j FROM JobEntity j " +
            "LEFT JOIN FETCH j.skills s " +
            "LEFT JOIN FETCH j.recruiter r " +
            "WHERE j.deleted = false " +
            "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
            +
            "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:minSalary IS NULL OR j.minSalary >= :minSalary) " +
            "AND (:maxSalary IS NULL OR j.maxSalary <= :maxSalary) " +
            "AND (:experience IS NULL OR j.experience = :experience) " +
            "AND (:employmentType IS NULL OR j.employmentType = :employmentType) " +
            "AND (:companyName IS NULL OR LOWER(r.companyName) LIKE LOWER(CONCAT('%', :companyName, '%'))) " +
            "AND (:skillName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%')))")
    Page<JobEntity> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("minSalary") Integer minSalary,
            @Param("maxSalary") Integer maxSalary,
            @Param("experience") String experience,
            @Param("employmentType") String employmentType,
            @Param("companyName") String companyName,
            @Param("skillName") String skillName,
            Pageable pageable);

    // Lấy danh sách job cơ bản có phân trang (tối ưu hóa JOIN FETCH)
    @Query(value = "SELECT DISTINCT j FROM JobEntity j LEFT JOIN FETCH j.skills LEFT JOIN FETCH j.recruiter WHERE j.deleted = false", countQuery = "SELECT COUNT(j) FROM JobEntity j WHERE j.deleted = false")
    Page<JobEntity> findByDeletedFalse(Pageable pageable);

    @Query(value = "SELECT DISTINCT j FROM JobEntity j " +
            "LEFT JOIN FETCH j.skills " +
            "LEFT JOIN FETCH j.recruiter " +
            "WHERE j.deleted = false", countQuery = "SELECT COUNT(j) FROM JobEntity j WHERE j.deleted = false")
    Page<JobEntity> findAllOptimized(Pageable pageable);

    @Query("SELECT s.name FROM SkillEntity s " +
            "JOIN s.jobs j " +
            "WHERE j.deleted = false " +
            "GROUP BY s.id, s.name " +
            "ORDER BY COUNT(j) DESC")
    List<String> findTopTrendingKeywords(Pageable pageable);

    List<JobEntity> findByRecruiterIdAndDeletedFalse(String recruiterId);

    @Query("SELECT ap FROM ApplicationEntity ap JOIN ap.job j WHERE j.id = :jobId AND j.recruiter.id = :recruiterId")
    List<ApplicationEntity> findByJobIdAndRecruiterId(@Param("jobId") String jobId,
            @Param("recruiterId") String recruiterId);
}
