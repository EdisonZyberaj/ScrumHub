package dev.scrumHub.service;

import dev.scrumHub.model.Release;
import dev.scrumHub.model.Project;
import dev.scrumHub.model.User;
import dev.scrumHub.repository.ReleaseRepository;
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
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Release> getReleasesByProject(Long projectId) {
        return releaseRepository.findByProjectIdOrderByPlannedReleaseDateDesc(projectId);
    }

    public List<Release> getReleasesByStatus(Long projectId, Release.ReleaseStatus status) {
        return releaseRepository.findByProjectIdAndStatusOrderByPlannedReleaseDate(projectId, status);
    }

    public List<Release> getActiveReleases(Long projectId) {
        return releaseRepository.findActiveReleasesByProjectId(projectId);
    }

    public Optional<Release> getCurrentRelease(Long projectId) {
        return releaseRepository.findCurrentReleaseByProjectId(projectId);
    }

    public Optional<Release> getNextPlannedRelease(Long projectId) {
        return releaseRepository.findNextPlannedReleaseByProjectId(projectId);
    }

    public Release createRelease(Long projectId, String name, String description, String versionNumber,
                               Release.ReleasePriority priority, LocalDateTime plannedStartDate,
                               LocalDateTime plannedReleaseDate, Integer targetStoryPoints, String goals) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        User currentUser = getCurrentUser();

        if (!hasReleaseManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to create releases");
        }

        if (releaseRepository.existsByProjectAndVersionNumber(project, versionNumber)) {
            throw new RuntimeException("Version number already exists for this project");
        }

        Release release = Release.builder()
                .name(name)
                .description(description)
                .versionNumber(versionNumber)
                .status(Release.ReleaseStatus.PLANNED)
                .priority(priority != null ? priority : Release.ReleasePriority.MEDIUM)
                .plannedStartDate(plannedStartDate)
                .plannedReleaseDate(plannedReleaseDate)
                .targetStoryPoints(targetStoryPoints)
                .releaseGoals(goals)
                .project(project)
                .createdBy(currentUser)
                .build();

        return releaseRepository.save(release);
    }

    public Release updateRelease(Long releaseId, String name, String description, String versionNumber,
                               Release.ReleaseStatus status, Release.ReleasePriority priority,
                               LocalDateTime plannedStartDate, LocalDateTime plannedReleaseDate,
                               Integer targetStoryPoints, String goals, String releaseNotes) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new RuntimeException("Release not found with id: " + releaseId));

        User currentUser = getCurrentUser();

        if (!hasReleaseManagementPermission(currentUser) && !release.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to edit this release");
        }

        if (name != null) release.setName(name);
        if (description != null) release.setDescription(description);
        if (versionNumber != null) {
            if (!release.getVersionNumber().equals(versionNumber) &&
                releaseRepository.existsByProjectAndVersionNumber(release.getProject(), versionNumber)) {
                throw new RuntimeException("Version number already exists for this project");
            }
            release.setVersionNumber(versionNumber);
        }
        if (status != null) release.setStatus(status);
        if (priority != null) release.setPriority(priority);
        if (plannedStartDate != null) release.setPlannedStartDate(plannedStartDate);
        if (plannedReleaseDate != null) release.setPlannedReleaseDate(plannedReleaseDate);
        if (targetStoryPoints != null) release.setTargetStoryPoints(targetStoryPoints);
        if (goals != null) release.setReleaseGoals(goals);
        if (releaseNotes != null) release.setReleaseNotes(releaseNotes);

        return releaseRepository.save(release);
    }

    public Release startRelease(Long releaseId) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new RuntimeException("Release not found with id: " + releaseId));

        User currentUser = getCurrentUser();

        if (!hasReleaseManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to start this release");
        }

        if (release.getStatus() != Release.ReleaseStatus.PLANNED) {
            throw new RuntimeException("Release must be in PLANNED status to be started");
        }

        release.setStatus(Release.ReleaseStatus.IN_PROGRESS);

        return releaseRepository.save(release);
    }

    public Release moveToTesting(Long releaseId) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new RuntimeException("Release not found with id: " + releaseId));

        User currentUser = getCurrentUser();

        if (!hasReleaseManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to move this release to testing");
        }

        if (release.getStatus() != Release.ReleaseStatus.IN_PROGRESS) {
            throw new RuntimeException("Release must be in IN_PROGRESS status to move to testing");
        }

        release.setStatus(Release.ReleaseStatus.TESTING);

        return releaseRepository.save(release);
    }

    public Release deployRelease(Long releaseId) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new RuntimeException("Release not found with id: " + releaseId));

        User currentUser = getCurrentUser();

        if (!hasReleaseManagementPermission(currentUser)) {
            throw new RuntimeException("You don't have permission to deploy this release");
        }

        if (release.getStatus() != Release.ReleaseStatus.READY) {
            throw new RuntimeException("Release must be in READY status to be deployed");
        }

        release.setStatus(Release.ReleaseStatus.RELEASED);
        release.setActualReleaseDate(LocalDateTime.now());

        return releaseRepository.save(release);
    }

    public List<Release> getOverdueReleases(Long projectId) {
        return releaseRepository.findOverdueReleasesByProjectId(projectId, LocalDateTime.now());
    }

    public List<Release> getUpcomingReleases(Long projectId, int days) {
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusDays(days);
        return releaseRepository.findUpcomingReleasesByProjectId(projectId, startDate, endDate);
    }

    public List<Release> searchReleases(Long projectId, String searchTerm) {
        return releaseRepository.searchReleasesByProjectId(projectId, searchTerm);
    }

    public ReleaseStatistics getReleaseStatistics(Long projectId) {
        Object[] stats = releaseRepository.getReleaseStatisticsByProjectId(projectId);

        if (stats.length > 0 && stats[0] != null) {
            return ReleaseStatistics.builder()
                    .totalReleases(((Number) stats[0]).longValue())
                    .completedReleases(((Number) stats[1]).longValue())
                    .inProgressReleases(((Number) stats[2]).longValue())
                    .overdueReleases(((Number) stats[3]).longValue())
                    .build();
        }

        return ReleaseStatistics.builder().build();
    }

    public Optional<Release> getReleaseWithSprints(Long releaseId) {
        return releaseRepository.findByIdWithSprints(releaseId);
    }

    public void deleteRelease(Long releaseId) {
        Release release = releaseRepository.findById(releaseId)
                .orElseThrow(() -> new RuntimeException("Release not found with id: " + releaseId));

        User currentUser = getCurrentUser();

        if (!hasReleaseManagementPermission(currentUser) && !release.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this release");
        }

        if (!release.getSprints().isEmpty()) {
            throw new RuntimeException("Cannot delete release with associated sprints. Please remove or reassign them first.");
        }

        releaseRepository.delete(release);
    }


    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean hasReleaseManagementPermission(User user) {
        return user.getRole() == User.UserRole.PRODUCT_OWNER ||
               user.getRole() == User.UserRole.SCRUM_MASTER;
    }

    @lombok.Data
    @lombok.Builder
    public static class ReleaseStatistics {
        private Long totalReleases;
        private Long completedReleases;
        private Long inProgressReleases;
        private Long overdueReleases;
    }
}