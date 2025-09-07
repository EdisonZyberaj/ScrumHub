package dev.scrumHub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bug_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BugReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String stepsToReproduce;

    @Column(length = 1000)
    private String expectedBehavior;

    @Column(length = 1000)
    private String actualBehavior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BugSeverity severity = BugSeverity.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BugStatus status = BugStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum BugSeverity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum BugStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }
}