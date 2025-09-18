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
@Table(name = "epics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"project", "backlogItems", "createdBy"})
@ToString(exclude = {"project", "backlogItems", "createdBy"})
public class Epic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "business_value", columnDefinition = "TEXT")
    private String businessValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EpicStatus status = EpicStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EpicPriority priority = EpicPriority.MEDIUM;

    @Column(name = "estimated_story_points")
    private Integer estimatedStoryPoints;

    @Column(name = "target_release")
    private String targetRelease;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "target_completion_date")
    private LocalDateTime targetCompletionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "epic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<ProductBacklogItem> backlogItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum EpicStatus {
        NEW,
        IN_PROGRESS,
        TESTING,
        COMPLETED,
        CANCELLED
    }

    public enum EpicPriority {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW
    }

    public void addBacklogItem(ProductBacklogItem item) {
        backlogItems.add(item);
        item.setEpic(this);
    }

    public void removeBacklogItem(ProductBacklogItem item) {
        backlogItems.remove(item);
        item.setEpic(null);
    }

    public int getCompletedStoryPoints() {
        return backlogItems.stream()
                .filter(item -> item.getStatus() == ProductBacklogItem.BacklogStatus.DONE)
                .mapToInt(item -> item.getStoryPoints() != null ? item.getStoryPoints() : 0)
                .sum();
    }

    public int getTotalStoryPoints() {
        return backlogItems.stream()
                .mapToInt(item -> item.getStoryPoints() != null ? item.getStoryPoints() : 0)
                .sum();
    }

    public double getCompletionPercentage() {
        int total = getTotalStoryPoints();
        if (total == 0) return 0.0;
        return (double) getCompletedStoryPoints() / total * 100.0;
    }

    public boolean isCompleted() {
        return status == EpicStatus.COMPLETED ||
               (!backlogItems.isEmpty() &&
                backlogItems.stream().allMatch(item -> item.getStatus() == ProductBacklogItem.BacklogStatus.DONE));
    }

    public boolean isOverdue() {
        return targetCompletionDate != null &&
               LocalDateTime.now().isAfter(targetCompletionDate) &&
               !isCompleted();
    }

    public long getDaysUntilTarget() {
        if (targetCompletionDate == null) return 0;
        return java.time.Duration.between(LocalDateTime.now(), targetCompletionDate).toDays();
    }
}