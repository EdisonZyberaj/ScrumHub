package dev.scrumHub.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_backlog_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"project", "epic", "createdBy", "assignedTo", "relatedTask"})
@ToString(exclude = {"project", "epic", "createdBy", "assignedTo", "relatedTask"})
public class ProductBacklogItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "acceptance_criteria", columnDefinition = "TEXT")
    private String acceptanceCriteria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BacklogItemType type = BacklogItemType.USER_STORY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BacklogStatus status = BacklogStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BacklogPriority priority = BacklogPriority.MEDIUM;

    @Column(name = "backlog_priority_order", nullable = false)
    @Builder.Default
    private Integer backlogPriorityOrder = 999;

    @Column(name = "story_points")
    private Integer storyPoints;

    @Column(name = "business_value")
    private Integer businessValue;

    @Column(name = "estimated_hours")
    private Double estimatedHours;

    @Column(name = "user_persona", length = 100)
    private String userPersona;

    @Column(name = "definition_of_done", columnDefinition = "TEXT")
    private String definitionOfDone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "epic_id")
    @JsonBackReference
    private Epic epic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_task_id")
    private Task relatedTask;

    @Column(name = "moved_to_sprint_at")
    private LocalDateTime movedToSprintAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum BacklogItemType {
        USER_STORY,
        FEATURE,
        BUG,
        TECHNICAL_DEBT,
        SPIKE,
        EPIC_STORY,
        ENHANCEMENT
    }

    public enum BacklogStatus {
        NEW,
        READY,
        IN_SPRINT,
        IN_PROGRESS,
        TESTING,
        DONE,
        CANCELLED
    }

    public enum BacklogPriority {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW
    }

    public boolean isReadyForSprint() {
        return status == BacklogStatus.READY &&
               storyPoints != null &&
               acceptanceCriteria != null &&
               !acceptanceCriteria.trim().isEmpty();
    }

    public boolean isInActiveDevelopment() {
        return status == BacklogStatus.IN_PROGRESS ||
               status == BacklogStatus.TESTING ||
               status == BacklogStatus.IN_SPRINT;
    }

    public boolean isCompleted() {
        return status == BacklogStatus.DONE;
    }

    public String getUserStoryFormat() {
        if (userPersona != null && !userPersona.trim().isEmpty()) {
            return String.format("As a %s, I want %s so that %s",
                    userPersona, title, businessValue != null ? "I can achieve business value" : "I can accomplish my goal");
        }
        return title;
    }

    public int getComplexityScore() {
        int baseScore = storyPoints != null ? storyPoints : 5;

        switch (type) {
            case SPIKE:
            case TECHNICAL_DEBT:
                return baseScore + 2;
            case BUG:
                return Math.max(baseScore - 1, 1);
            case EPIC_STORY:
                return baseScore + 3;
            default:
                return baseScore;
        }
    }

    public boolean needsRefinement() {
        return status == BacklogStatus.NEW ||
               storyPoints == null ||
               acceptanceCriteria == null ||
               acceptanceCriteria.trim().isEmpty();
    }

    public void moveToSprint() {
        this.status = BacklogStatus.IN_SPRINT;
        this.movedToSprintAt = LocalDateTime.now();
    }

    public void markAsReady() {
        if (needsRefinement()) {
            throw new IllegalStateException("Cannot mark as ready - item needs refinement");
        }
        this.status = BacklogStatus.READY;
    }

    public long getDaysInBacklog() {
        return java.time.Duration.between(createdAt, LocalDateTime.now()).toDays();
    }
}