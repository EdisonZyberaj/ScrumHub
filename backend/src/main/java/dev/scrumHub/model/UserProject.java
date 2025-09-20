package dev.scrumHub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProject {

    @EmbeddedId
    private UserProjectId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("projectId")
    @JoinColumn(name = "project_id")
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_in_project", nullable = false)
    private ProjectRole roleInProject = ProjectRole.DEVELOPER;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "is_active")
    private boolean isActive = true;

    public enum ProjectRole {
        SCRUM_MASTER, PRODUCT_OWNER, DEVELOPER, TESTER
    }
}