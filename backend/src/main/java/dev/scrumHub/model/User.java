package dev.scrumHub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserProject> projectMemberships = new HashSet<>();

    @OneToMany(mappedBy = "assignee")
    private Set<Task> assignedTasks = new HashSet<>();

    @OneToMany(mappedBy = "createdBy")
    private Set<Task> createdTasks = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    private Set<DeveloperBoard> developerBoardItems = new HashSet<>();

    @OneToMany(mappedBy = "tester")
    private Set<TesterBoard> testerBoardItems = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskComment> comments = new HashSet<>();

    @OneToMany(mappedBy = "createdBy")
    private Set<TestCase> createdTestCases = new HashSet<>();

    @OneToMany(mappedBy = "reportedBy")
    private Set<BugReport> reportedBugs = new HashSet<>();

    @OneToMany(mappedBy = "assignedTo")
    private Set<BugReport> assignedBugs = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TimeLog> timeLogs = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_projects",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Set<Project> projects = new HashSet<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum UserRole {
        GUEST, DEVELOPER, TESTER, SCRUM_MASTER
    }
}