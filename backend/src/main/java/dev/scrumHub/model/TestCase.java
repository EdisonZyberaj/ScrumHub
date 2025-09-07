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
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String steps;

    @Column(length = 1000)
    private String expectedResult;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestStatus status = TestStatus.READY_FOR_MANUAL_TEST;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestType type = TestType.MANUAL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum TestStatus {
        READY_FOR_MANUAL_TEST, IN_DESIGN, PASSED_TEST, FAILED_TEST
    }

    public enum TestType {
        MANUAL, AUTOMATED
    }
}