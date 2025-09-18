package dev.scrumHub.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "releases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"project", "sprints", "createdBy"})
@ToString(exclude = {"project", "sprints", "createdBy"})
public class Release {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "version_number")
    private String versionNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "release_notes", columnDefinition = "TEXT")
    private String releaseNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReleaseStatus status = ReleaseStatus.PLANNED;

    @Column(name = "planned_start_date")
    private LocalDateTime plannedStartDate;

    @Column(name = "planned_release_date")
    private LocalDateTime plannedReleaseDate;

    @Column(name = "actual_release_date")
    private LocalDateTime actualReleaseDate;

    @Column(name = "target_story_points")
    private Integer targetStoryPoints;

    @Column(name = "release_goals", columnDefinition = "TEXT")
    private String releaseGoals;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReleasePriority priority = ReleasePriority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "release", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<Sprint> sprints = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum ReleaseStatus {
        PLANNED,
        IN_PROGRESS,
        TESTING,
        READY,
        RELEASED,
        CANCELLED
    }

    public enum ReleasePriority {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW
    }

    public void addSprint(Sprint sprint) {
        sprints.add(sprint);
        sprint.setRelease(this);
    }

    public void removeSprint(Sprint sprint) {
        sprints.remove(sprint);
        sprint.setRelease(null);
    }

    public int getCompletedStoryPoints() {
        return sprints.stream()
                .filter(sprint -> sprint.getStatus() == Sprint.SprintStatus.COMPLETED)
                .mapToInt(this::getSprintStoryPoints)
                .sum();
    }

    public int getTotalStoryPoints() {
        return sprints.stream()
                .mapToInt(this::getSprintStoryPoints)
                .sum();
    }

    private int getSprintStoryPoints(Sprint sprint) {
        return 0;
    }

    public double getCompletionPercentage() {
        int total = getTotalStoryPoints();
        if (total == 0) return 0.0;
        return (double) getCompletedStoryPoints() / total * 100.0;
    }

    public boolean isOverdue() {
        return plannedReleaseDate != null &&
               LocalDateTime.now().isAfter(plannedReleaseDate) &&
               status != ReleaseStatus.RELEASED;
    }

    public long getDaysUntilRelease() {
        if (plannedReleaseDate == null) return 0;
        return java.time.Duration.between(LocalDateTime.now(), plannedReleaseDate).toDays();
    }

    public boolean isActive() {
        return status == ReleaseStatus.IN_PROGRESS || status == ReleaseStatus.TESTING;
    }

    public boolean isCompleted() {
        return status == ReleaseStatus.RELEASED;
    }

    public int getActiveSprints() {
        return (int) sprints.stream()
                .filter(sprint -> sprint.getStatus() == Sprint.SprintStatus.ACTIVE)
                .count();
    }

    public int getCompletedSprints() {
        return (int) sprints.stream()
                .filter(sprint -> sprint.getStatus() == Sprint.SprintStatus.COMPLETED)
                .count();
    }

    public Sprint getCurrentSprint() {
        return sprints.stream()
                .filter(sprint -> sprint.getStatus() == Sprint.SprintStatus.ACTIVE)
                .findFirst()
                .orElse(null);
    }

    public Sprint getNextPlannedSprint() {
        return sprints.stream()
                .filter(sprint -> sprint.getStatus() == Sprint.SprintStatus.PLANNED)
                .findFirst()
                .orElse(null);
    }

    public LocalDateTime getEstimatedCompletionDate() {
        return sprints.stream()
                .map(Sprint::getEndDate)
                .max(LocalDateTime::compareTo)
                .orElse(plannedReleaseDate);
    }

    public boolean canBeReleased() {
        return status == ReleaseStatus.READY &&
               sprints.stream().allMatch(sprint ->
                       sprint.getStatus() == Sprint.SprintStatus.COMPLETED);
    }

    public void markAsReleased() {
        this.status = ReleaseStatus.RELEASED;
        this.actualReleaseDate = LocalDateTime.now();
    }
}