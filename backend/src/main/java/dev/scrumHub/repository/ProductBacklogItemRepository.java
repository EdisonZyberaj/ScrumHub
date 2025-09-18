package dev.scrumHub.repository;

import dev.scrumHub.model.ProductBacklogItem;
import dev.scrumHub.model.Project;
import dev.scrumHub.model.Epic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductBacklogItemRepository extends JpaRepository<ProductBacklogItem, Long> {

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId ORDER BY pbi.backlogPriorityOrder ASC, pbi.createdAt DESC")
    List<ProductBacklogItem> findProductBacklogByProjectIdOrderByPriority(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.status = :status ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByProjectIdAndStatusOrderByPriority(@Param("projectId") Long projectId, @Param("status") ProductBacklogItem.BacklogStatus status);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.status = 'READY' ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findReadyItemsByProjectIdOrderByPriority(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND (pbi.status = 'NEW' OR pbi.storyPoints IS NULL OR pbi.acceptanceCriteria IS NULL OR pbi.acceptanceCriteria = '') ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findItemsNeedingRefinementByProjectId(@Param("projectId") Long projectId);

    List<ProductBacklogItem> findByEpicOrderByBacklogPriorityOrderAsc(Epic epic);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.epic.id = :epicId ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByEpicIdOrderByPriorityOrder(@Param("epicId") Long epicId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.epic IS NULL ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findOrphanedItemsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.type = :type ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByProjectIdAndTypeOrderByPriority(@Param("projectId") Long projectId, @Param("type") ProductBacklogItem.BacklogItemType type);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.priority = :priority ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByProjectIdAndPriorityOrderByPriorityOrder(@Param("projectId") Long projectId, @Param("priority") ProductBacklogItem.BacklogPriority priority);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.storyPoints >= :minPoints AND pbi.storyPoints <= :maxPoints ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByProjectIdAndStoryPointsRangeOrderByPriority(@Param("projectId") Long projectId, @Param("minPoints") Integer minPoints, @Param("maxPoints") Integer maxPoints);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.assignedTo.id = :assignedToId ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByProjectIdAndAssignedToIdOrderByPriority(@Param("projectId") Long projectId, @Param("assignedToId") Long assignedToId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.createdBy.id = :createdById ORDER BY pbi.createdAt DESC")
    List<ProductBacklogItem> findByProjectIdAndCreatedByIdOrderByCreatedAt(@Param("projectId") Long projectId, @Param("createdById") Long createdById);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND (LOWER(pbi.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(pbi.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> searchByProjectIdAndContent(@Param("projectId") Long projectId, @Param("searchTerm") String searchTerm);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId ORDER BY pbi.createdAt DESC")
    List<ProductBacklogItem> findRecentlyAddedByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.status = 'IN_SPRINT' ORDER BY pbi.movedToSprintAt DESC")
    List<ProductBacklogItem> findRecentlyMovedToSprintByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(pbi) FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.status = :status")
    Long countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") ProductBacklogItem.BacklogStatus status);

    @Query("SELECT COALESCE(SUM(pbi.storyPoints), 0) FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.status = :status")
    Long getTotalStoryPointsByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") ProductBacklogItem.BacklogStatus status);

    @Query("SELECT " +
            "COUNT(pbi) as totalItems, " +
            "COALESCE(SUM(pbi.storyPoints), 0) as totalStoryPoints, " +
            "SUM(CASE WHEN pbi.status = 'READY' THEN 1 ELSE 0 END) as readyItems, " +
            "SUM(CASE WHEN pbi.status = 'NEW' THEN 1 ELSE 0 END) as newItems, " +
            "SUM(CASE WHEN pbi.status = 'DONE' THEN 1 ELSE 0 END) as completedItems " +
            "FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId")
    Object[] getBacklogStatisticsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT MAX(pbi.backlogPriorityOrder) FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId")
    Optional<Integer> findMaxPriorityOrderByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.status = 'READY' AND pbi.storyPoints IS NOT NULL ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findSprintReadyItemsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.relatedTask IS NOT NULL ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findItemsWithTasksByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.storyPoints IS NULL ORDER BY pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findItemsWithoutStoryPointsByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT pbi FROM ProductBacklogItem pbi WHERE pbi.project.id = :projectId AND pbi.businessValue >= :minValue AND pbi.businessValue <= :maxValue ORDER BY pbi.businessValue DESC, pbi.backlogPriorityOrder ASC")
    List<ProductBacklogItem> findByProjectIdAndBusinessValueRangeOrderByValue(@Param("projectId") Long projectId, @Param("minValue") Integer minValue, @Param("maxValue") Integer maxValue);

    void deleteByProject(Project project);

    boolean existsByProjectAndTitle(Project project, String title);
}