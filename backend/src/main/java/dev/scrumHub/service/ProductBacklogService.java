package dev.scrumHub.service;

import dev.scrumHub.model.*;
import dev.scrumHub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductBacklogService {

    private final ProductBacklogItemRepository backlogItemRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EpicRepository epicRepository;
    private final TaskRepository taskRepository;

    public List<ProductBacklogItem> getProductBacklog(Long projectId) {
        return backlogItemRepository.findProductBacklogByProjectIdOrderByPriority(projectId);
    }

    public List<ProductBacklogItem> getBacklogItemsByStatus(Long projectId, ProductBacklogItem.BacklogStatus status) {
        return backlogItemRepository.findByProjectIdAndStatusOrderByPriority(projectId, status);
    }

    public List<ProductBacklogItem> getReadyItemsForSprint(Long projectId) {
        return backlogItemRepository.findReadyItemsByProjectIdOrderByPriority(projectId);
    }

    public List<ProductBacklogItem> getItemsNeedingRefinement(Long projectId) {
        return backlogItemRepository.findItemsNeedingRefinementByProjectId(projectId);
    }

    public ProductBacklogItem createBacklogItem(Long projectId, String title, String description,
                                               ProductBacklogItem.BacklogItemType type, Long epicId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        User currentUser = getCurrentUser();

        Integer nextPriorityOrder = backlogItemRepository.findMaxPriorityOrderByProjectId(projectId)
                .orElse(0) + 1;

        Epic epic = null;
        if (epicId != null) {
            epic = epicRepository.findById(epicId)
                    .orElseThrow(() -> new RuntimeException("Epic not found with id: " + epicId));
        }

        ProductBacklogItem item = ProductBacklogItem.builder()
                .title(title)
                .description(description)
                .type(type)
                .status(ProductBacklogItem.BacklogStatus.NEW)
                .priority(ProductBacklogItem.BacklogPriority.MEDIUM)
                .backlogPriorityOrder(nextPriorityOrder)
                .project(project)
                .epic(epic)
                .createdBy(currentUser)
                .build();

        return backlogItemRepository.save(item);
    }

    public ProductBacklogItem updateBacklogItem(Long itemId, String title, String description,
                                               String acceptanceCriteria, Integer storyPoints,
                                               ProductBacklogItem.BacklogPriority priority) {
        ProductBacklogItem item = backlogItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + itemId));

        User currentUser = getCurrentUser();

        if (!hasProductOwnerRole(currentUser) && !item.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to edit this backlog item");
        }

        if (title != null) item.setTitle(title);
        if (description != null) item.setDescription(description);
        if (acceptanceCriteria != null) item.setAcceptanceCriteria(acceptanceCriteria);
        if (storyPoints != null) item.setStoryPoints(storyPoints);
        if (priority != null) item.setPriority(priority);

        return backlogItemRepository.save(item);
    }

    public void reorderBacklogItems(Long projectId, List<Long> itemIdsInOrder) {
        User currentUser = getCurrentUser();

        if (!hasProductOwnerRole(currentUser)) {
            throw new RuntimeException("Only Product Owners can reorder the backlog");
        }

        for (int i = 0; i < itemIdsInOrder.size(); i++) {
            Long itemId = itemIdsInOrder.get(i);
            ProductBacklogItem item = backlogItemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + itemId));

            if (!item.getProject().getId().equals(projectId)) {
                throw new RuntimeException("Item does not belong to the specified project");
            }

            item.setBacklogPriorityOrder(i + 1);
            backlogItemRepository.save(item);
        }
    }

    public Task moveItemToSprint(Long itemId, Long sprintId) {
        ProductBacklogItem item = backlogItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + itemId));

        User currentUser = getCurrentUser();

        if (!item.isReadyForSprint()) {
            throw new RuntimeException("Item is not ready for sprint. Please ensure it has story points and acceptance criteria.");
        }

        Task task = Task.builder()
                .title(item.getTitle())
                .description(item.getDescription())
                .acceptanceCriteria(item.getAcceptanceCriteria())
                .type(convertBacklogTypeToTaskType(item.getType()))
                .priority(convertBacklogPriorityToTaskPriority(item.getPriority()))
                .status(Task.TaskStatus.TO_DO)
                .estimatedHours(item.getEstimatedHours() != null ? item.getEstimatedHours().intValue() : null)
                .project(item.getProject())
                .createdBy(currentUser)
                .build();

        if (sprintId != null) {
        }

        Task savedTask = taskRepository.save(task);

        item.setStatus(ProductBacklogItem.BacklogStatus.IN_SPRINT);
        item.setRelatedTask(savedTask);
        item.moveToSprint();
        backlogItemRepository.save(item);

        return savedTask;
    }

    public ProductBacklogItem markAsReady(Long itemId) {
        ProductBacklogItem item = backlogItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + itemId));

        User currentUser = getCurrentUser();

        if (!hasProductOwnerRole(currentUser) && !item.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to modify this backlog item");
        }

        item.markAsReady();
        return backlogItemRepository.save(item);
    }

    public ProductBacklogItem assignToEpic(Long itemId, Long epicId) {
        ProductBacklogItem item = backlogItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + itemId));

        Epic epic = null;
        if (epicId != null) {
            epic = epicRepository.findById(epicId)
                    .orElseThrow(() -> new RuntimeException("Epic not found with id: " + epicId));

            if (!epic.getProject().getId().equals(item.getProject().getId())) {
                throw new RuntimeException("Epic and backlog item must belong to the same project");
            }
        }

        item.setEpic(epic);
        return backlogItemRepository.save(item);
    }

    public List<ProductBacklogItem> getEpicBacklogItems(Long epicId) {
        return backlogItemRepository.findByEpicIdOrderByPriorityOrder(epicId);
    }

    public List<ProductBacklogItem> searchBacklogItems(Long projectId, String searchTerm) {
        return backlogItemRepository.searchByProjectIdAndContent(projectId, searchTerm);
    }

    public BacklogStatistics getBacklogStatistics(Long projectId) {
        Object[] stats = backlogItemRepository.getBacklogStatisticsByProjectId(projectId);

        if (stats.length > 0 && stats[0] != null) {
            return BacklogStatistics.builder()
                    .totalItems(((Number) stats[0]).longValue())
                    .totalStoryPoints(((Number) stats[1]).longValue())
                    .readyItems(((Number) stats[2]).longValue())
                    .newItems(((Number) stats[3]).longValue())
                    .completedItems(((Number) stats[4]).longValue())
                    .build();
        }

        return BacklogStatistics.builder().build();
    }

    public void deleteBacklogItem(Long itemId) {
        ProductBacklogItem item = backlogItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Backlog item not found with id: " + itemId));

        User currentUser = getCurrentUser();

        if (!hasProductOwnerRole(currentUser) && !item.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this backlog item");
        }

        backlogItemRepository.delete(item);
    }


    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean hasProductOwnerRole(User user) {
        return user.getRole() == User.UserRole.PRODUCT_OWNER;
    }

    private Task.TaskType convertBacklogTypeToTaskType(ProductBacklogItem.BacklogItemType backlogType) {
        return switch (backlogType) {
            case USER_STORY -> Task.TaskType.USER_STORY;
            case FEATURE -> Task.TaskType.FEATURE;
            case BUG -> Task.TaskType.BUG;
            case TECHNICAL_DEBT -> Task.TaskType.TASK;
            case SPIKE -> Task.TaskType.TASK;
            case EPIC_STORY -> Task.TaskType.USER_STORY;
            case ENHANCEMENT -> Task.TaskType.FEATURE;
        };
    }

    private Task.TaskPriority convertBacklogPriorityToTaskPriority(ProductBacklogItem.BacklogPriority backlogPriority) {
        return switch (backlogPriority) {
            case CRITICAL -> Task.TaskPriority.CRITICAL;
            case HIGH -> Task.TaskPriority.HIGH;
            case MEDIUM -> Task.TaskPriority.MEDIUM;
            case LOW -> Task.TaskPriority.LOW;
        };
    }

    @lombok.Data
    @lombok.Builder
    public static class BacklogStatistics {
        private Long totalItems;
        private Long totalStoryPoints;
        private Long readyItems;
        private Long newItems;
        private Long completedItems;
    }
}