package dev.scrumHub.repository;

import dev.scrumHub.model.Epic;
import dev.scrumHub.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EpicRepository extends JpaRepository<Epic, Long> {

    List<Epic> findByProjectOrderByCreatedAtDesc(Project project);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId ORDER BY e.createdAt DESC")
    List<Epic> findByProjectIdOrderByCreatedAtDesc(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.status = :status ORDER BY e.createdAt DESC")
    List<Epic> findByProjectIdAndStatusOrderByCreatedAtDesc(@Param("projectId") Long projectId, @Param("status") Epic.EpicStatus status);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.priority = :priority ORDER BY e.createdAt DESC")
    List<Epic> findByProjectIdAndPriorityOrderByCreatedAtDesc(@Param("projectId") Long projectId, @Param("priority") Epic.EpicPriority priority);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.createdBy.id = :createdById ORDER BY e.createdAt DESC")
    List<Epic> findByProjectIdAndCreatedByIdOrderByCreatedAtDesc(@Param("projectId") Long projectId, @Param("createdById") Long createdById);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY e.priority DESC, e.createdAt DESC")
    List<Epic> findActiveEpicsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.status = 'COMPLETED' ORDER BY e.updatedAt DESC")
    List<Epic> findCompletedEpicsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.targetCompletionDate < CURRENT_TIMESTAMP AND e.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY e.targetCompletionDate ASC")
    List<Epic> findOverdueEpicsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND (LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) ORDER BY e.createdAt DESC")
    List<Epic> searchEpicsByProjectId(@Param("projectId") Long projectId, @Param("searchTerm") String searchTerm);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.targetRelease = :targetRelease ORDER BY e.priority DESC, e.createdAt DESC")
    List<Epic> findByProjectIdAndTargetReleaseOrderByPriorityDesc(@Param("projectId") Long projectId, @Param("targetRelease") String targetRelease);

    @Query("SELECT COUNT(e) FROM Epic e WHERE e.project.id = :projectId AND e.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") Epic.EpicStatus status);

    @Query("SELECT DISTINCT e FROM Epic e LEFT JOIN FETCH e.backlogItems WHERE e.id = :epicId")
    Optional<Epic> findByIdWithBacklogItems(@Param("epicId") Long epicId);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.targetCompletionDate IS NULL ORDER BY e.priority DESC, e.createdAt DESC")
    List<Epic> findEpicsWithoutTargetDateByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Epic e WHERE e.project.id = :projectId AND e.estimatedStoryPoints >= :minPoints AND e.estimatedStoryPoints <= :maxPoints ORDER BY e.estimatedStoryPoints DESC")
    List<Epic> findByProjectIdAndStoryPointsRange(@Param("projectId") Long projectId, @Param("minPoints") Integer minPoints, @Param("maxPoints") Integer maxPoints);

    @Query("SELECT " +
            "COUNT(e) as totalEpics, " +
            "SUM(CASE WHEN e.status = 'COMPLETED' THEN 1 ELSE 0 END) as completedEpics, " +
            "SUM(CASE WHEN e.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as inProgressEpics, " +
            "SUM(CASE WHEN e.targetCompletionDate < CURRENT_TIMESTAMP AND e.status NOT IN ('COMPLETED', 'CANCELLED') THEN 1 ELSE 0 END) as overdueEpics " +
            "FROM Epic e WHERE e.project.id = :projectId")
    Object[] getEpicStatisticsByProjectId(@Param("projectId") Long projectId);

    void deleteByProject(Project project);

    boolean existsByProjectAndTitle(Project project, String title);
}