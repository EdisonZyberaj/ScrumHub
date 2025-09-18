package dev.scrumHub.service;

import dev.scrumHub.model.Epic;
import dev.scrumHub.model.Project;
import dev.scrumHub.model.User;
import dev.scrumHub.repository.EpicRepository;
import dev.scrumHub.repository.ProjectRepository;
import dev.scrumHub.repository.UserRepository;
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
public class EpicService {

    private final EpicRepository epicRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Epic> getEpicsByProject(Long projectId) {
        return epicRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    public List<Epic> getActiveEpics(Long projectId) {
        return epicRepository.findActiveEpicsByProjectId(projectId);
    }

    public Optional<Epic> getEpicWithBacklogItems(Long epicId) {
        return epicRepository.findByIdWithBacklogItems(epicId);
    }

    public Epic createEpic(Long projectId, String title, String description, String businessValue,
                          Epic.EpicPriority priority, Integer estimatedStoryPoints, String targetRelease) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        User currentUser = getCurrentUser();

        if (!hasEpicManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to create epics");
        }

        Epic epic = Epic.builder()
                .title(title)
                .description(description)
                .businessValue(businessValue)
                .status(Epic.EpicStatus.NEW)
                .priority(priority != null ? priority : Epic.EpicPriority.MEDIUM)
                .estimatedStoryPoints(estimatedStoryPoints)
                .targetRelease(targetRelease)
                .project(project)
                .createdBy(currentUser)
                .build();

        return epicRepository.save(epic);
    }

    public Epic updateEpic(Long epicId, String title, String description, String businessValue,
                          Epic.EpicStatus status, Epic.EpicPriority priority,
                          Integer estimatedStoryPoints, String targetRelease,
                          LocalDateTime targetCompletionDate) {
        Epic epic = epicRepository.findById(epicId)
                .orElseThrow(() -> new RuntimeException("Epic not found with id: " + epicId));

        User currentUser = getCurrentUser();

        if (!hasEpicManagementPermission(currentUser) && !epic.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to edit this epic");
        }

        if (title != null) epic.setTitle(title);
        if (description != null) epic.setDescription(description);
        if (businessValue != null) epic.setBusinessValue(businessValue);
        if (status != null) epic.setStatus(status);
        if (priority != null) epic.setPriority(priority);
        if (estimatedStoryPoints != null) epic.setEstimatedStoryPoints(estimatedStoryPoints);
        if (targetRelease != null) epic.setTargetRelease(targetRelease);
        if (targetCompletionDate != null) epic.setTargetCompletionDate(targetCompletionDate);

        return epicRepository.save(epic);
    }

    public Epic startEpic(Long epicId) {
        Epic epic = epicRepository.findById(epicId)
                .orElseThrow(() -> new RuntimeException("Epic not found with id: " + epicId));

        User currentUser = getCurrentUser();

        if (!hasEpicManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to start this epic");
        }

        if (epic.getStatus() != Epic.EpicStatus.NEW) {
            throw new RuntimeException("Epic must be in NEW status to be started");
        }

        epic.setStatus(Epic.EpicStatus.IN_PROGRESS);
        epic.setStartDate(LocalDateTime.now());

        return epicRepository.save(epic);
    }

    public Epic completeEpic(Long epicId) {
        Epic epic = epicRepository.findById(epicId)
                .orElseThrow(() -> new RuntimeException("Epic not found with id: " + epicId));

        User currentUser = getCurrentUser();

        if (!hasEpicManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to complete this epic");
        }

        boolean allItemsCompleted = epic.getBacklogItems().stream()
                .allMatch(item -> item.getStatus() == dev.scrumHub.model.ProductBacklogItem.BacklogStatus.DONE);

        if (!allItemsCompleted) {
            throw new RuntimeException("Cannot complete epic - not all backlog items are done");
        }

        epic.setStatus(Epic.EpicStatus.COMPLETED);

        return epicRepository.save(epic);
    }

    public List<Epic> getEpicsByStatus(Long projectId, Epic.EpicStatus status) {
        return epicRepository.findByProjectIdAndStatusOrderByCreatedAtDesc(projectId, status);
    }

    public List<Epic> getOverdueEpics(Long projectId) {
        return epicRepository.findOverdueEpicsByProjectId(projectId);
    }

    public List<Epic> searchEpics(Long projectId, String searchTerm) {
        return epicRepository.searchEpicsByProjectId(projectId, searchTerm);
    }

    public EpicStatistics getEpicStatistics(Long projectId) {
        Object[] stats = epicRepository.getEpicStatisticsByProjectId(projectId);

        if (stats.length > 0 && stats[0] != null) {
            return EpicStatistics.builder()
                    .totalEpics(((Number) stats[0]).longValue())
                    .completedEpics(((Number) stats[1]).longValue())
                    .inProgressEpics(((Number) stats[2]).longValue())
                    .overdueEpics(((Number) stats[3]).longValue())
                    .build();
        }

        return EpicStatistics.builder().build();
    }

    public void deleteEpic(Long epicId) {
        Epic epic = epicRepository.findById(epicId)
                .orElseThrow(() -> new RuntimeException("Epic not found with id: " + epicId));

        User currentUser = getCurrentUser();

        if (!hasEpicManagementPermission(currentUser) && !epic.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this epic");
        }

        if (!epic.getBacklogItems().isEmpty()) {
            throw new RuntimeException("Cannot delete epic with associated backlog items. Please remove or reassign them first.");
        }

        epicRepository.delete(epic);
    }


    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean hasEpicManagementPermission(User user) {
        return user.getRole() == User.UserRole.PRODUCT_OWNER ||
               user.getRole() == User.UserRole.SCRUM_MASTER;
    }

    @lombok.Data
    @lombok.Builder
    public static class EpicStatistics {
        private Long totalEpics;
        private Long completedEpics;
        private Long inProgressEpics;
        private Long overdueEpics;
    }
}