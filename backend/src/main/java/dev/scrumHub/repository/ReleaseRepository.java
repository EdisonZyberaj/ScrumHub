package dev.scrumHub.repository;

import dev.scrumHub.model.Release;
import dev.scrumHub.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReleaseRepository extends JpaRepository<Release, Long> {

    List<Release> findByProjectOrderByPlannedReleaseDateDesc(Project project);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId ORDER BY r.plannedReleaseDate DESC")
    List<Release> findByProjectIdOrderByPlannedReleaseDateDesc(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = :status ORDER BY r.plannedReleaseDate ASC")
    List<Release> findByProjectIdAndStatusOrderByPlannedReleaseDate(@Param("projectId") Long projectId, @Param("status") Release.ReleaseStatus status);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status IN ('IN_PROGRESS', 'TESTING') ORDER BY r.plannedReleaseDate ASC")
    List<Release> findActiveReleasesByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = 'IN_PROGRESS' ORDER BY r.plannedReleaseDate ASC")
    Optional<Release> findCurrentReleaseByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = 'PLANNED' ORDER BY r.plannedReleaseDate ASC")
    Optional<Release> findNextPlannedReleaseByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.priority = :priority ORDER BY r.plannedReleaseDate ASC")
    List<Release> findByProjectIdAndPriorityOrderByPlannedReleaseDate(@Param("projectId") Long projectId, @Param("priority") Release.ReleasePriority priority);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.plannedReleaseDate < :currentDate AND r.status NOT IN ('RELEASED', 'CANCELLED') ORDER BY r.plannedReleaseDate ASC")
    List<Release> findOverdueReleasesByProjectId(@Param("projectId") Long projectId, @Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.plannedReleaseDate BETWEEN :startDate AND :endDate AND r.status NOT IN ('RELEASED', 'CANCELLED') ORDER BY r.plannedReleaseDate ASC")
    List<Release> findUpcomingReleasesByProjectId(@Param("projectId") Long projectId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = 'RELEASED' ORDER BY r.actualReleaseDate DESC")
    List<Release> findCompletedReleasesByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.createdBy.id = :createdById ORDER BY r.createdAt DESC")
    List<Release> findByProjectIdAndCreatedByIdOrderByCreatedAt(@Param("projectId") Long projectId, @Param("createdById") Long createdById);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND (LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) ORDER BY r.plannedReleaseDate DESC")
    List<Release> searchReleasesByProjectId(@Param("projectId") Long projectId, @Param("searchTerm") String searchTerm);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.versionNumber LIKE :versionPattern ORDER BY r.versionNumber DESC")
    List<Release> findByProjectIdAndVersionNumberPattern(@Param("projectId") Long projectId, @Param("versionPattern") String versionPattern);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = 'READY' ORDER BY r.plannedReleaseDate ASC")
    List<Release> findReadyForDeploymentByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT DISTINCT r FROM Release r LEFT JOIN FETCH r.sprints WHERE r.id = :releaseId")
    Optional<Release> findByIdWithSprints(@Param("releaseId") Long releaseId);

    @Query("SELECT COUNT(r) FROM Release r WHERE r.project.id = :projectId AND r.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") Release.ReleaseStatus status);

    @Query("SELECT " +
            "COUNT(r) as totalReleases, " +
            "SUM(CASE WHEN r.status = 'RELEASED' THEN 1 ELSE 0 END) as completedReleases, " +
            "SUM(CASE WHEN r.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as inProgressReleases, " +
            "SUM(CASE WHEN r.plannedReleaseDate < CURRENT_TIMESTAMP AND r.status NOT IN ('RELEASED', 'CANCELLED') THEN 1 ELSE 0 END) as overdueReleases " +
            "FROM Release r WHERE r.project.id = :projectId")
    Object[] getReleaseStatisticsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.plannedReleaseDate BETWEEN :startDate AND :endDate ORDER BY r.plannedReleaseDate ASC")
    List<Release> findByProjectIdAndDateRange(@Param("projectId") Long projectId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = 'RELEASED' ORDER BY r.actualReleaseDate DESC")
    Optional<Release> findLatestReleasedByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.targetStoryPoints IS NOT NULL ORDER BY r.targetStoryPoints DESC")
    List<Release> findReleasesWithTargetStoryPointsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.plannedReleaseDate IS NULL ORDER BY r.createdAt DESC")
    List<Release> findReleasesWithoutPlannedDateByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND YEAR(r.plannedReleaseDate) = :year AND MONTH(r.plannedReleaseDate) = :month ORDER BY r.plannedReleaseDate ASC")
    List<Release> findByProjectIdAndMonth(@Param("projectId") Long projectId, @Param("year") int year, @Param("month") int month);

    @Query("SELECT r FROM Release r WHERE r.project.id = :projectId AND r.status = 'PLANNED' AND r.plannedStartDate <= :currentDate ORDER BY r.plannedStartDate ASC")
    List<Release> findReadyToStartByProjectId(@Param("projectId") Long projectId, @Param("currentDate") LocalDateTime currentDate);

    void deleteByProject(Project project);

    boolean existsByProjectAndName(Project project, String name);

    boolean existsByProjectAndVersionNumber(Project project, String versionNumber);
}