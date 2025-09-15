package dev.scrumHub.service;

import dev.scrumHub.dto.UserStatsDto;
import dev.scrumHub.model.User;
import dev.scrumHub.model.User.UserRole;
import dev.scrumHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        dev.scrumHub.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    public Optional<dev.scrumHub.model.User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public dev.scrumHub.model.User save(dev.scrumHub.model.User user) {
        return userRepository.save(user);
    }

    public Optional<dev.scrumHub.model.User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<dev.scrumHub.model.User> findAllActiveUsers() {
        return userRepository.findAll().stream()
                .filter(User::isActive)
                .toList();
    }

    public List<dev.scrumHub.model.User> findByRoles(List<UserRole> roles) {
        return userRepository.findByRoleIn(roles);
    }

    public List<dev.scrumHub.model.User> findByProjectId(Long projectId) {
        return userRepository.findByProjectId(projectId);
    }

    public boolean existsByUsernameAndNotId(String username, Long userId) {
        return userRepository.existsByUsernameAndIdNot(username, userId);
    }

    public UserStatsDto getUserStatistics(Long userId) {
        dev.scrumHub.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserStatsDto.builder()
                .totalAssignedTasks((long) user.getAssignedTasks().size())
                .completedTasks(user.getAssignedTasks().stream()
                        .mapToLong(task -> "COMPLETED".equals(task.getStatus()) ? 1 : 0)
                        .sum())
                .activeTasks(user.getAssignedTasks().stream()
                        .mapToLong(task -> !"COMPLETED".equals(task.getStatus()) ? 1 : 0)
                        .sum())
                .totalProjectsJoined((long) user.getProjects().size())
                .totalCommentsPosted((long) user.getComments().size())
                .totalTimeLogged(user.getTimeLogs().stream()
                        .mapToLong(timeLog -> timeLog.getHoursWorked() != null ? timeLog.getHoursWorked() * 60L : 0)
                        .sum())
                .totalBugsReported((long) user.getReportedBugs().size())
                .totalBugsAssigned((long) user.getAssignedBugs().size())
                .totalTestCasesCreated((long) user.getCreatedTestCases().size())
                .memberSince(user.getCreatedAt())
                .build();
    }

    public Object getRecentUserActivity(Long userId) {
        dev.scrumHub.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return a summary of recent activity
        return java.util.Map.of(
                "recentTasks", user.getAssignedTasks().stream()
                        .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                        .limit(5)
                        .map(task -> java.util.Map.of(
                                "id", task.getId(),
                                "title", task.getTitle(),
                                "status", task.getStatus(),
                                "createdAt", task.getCreatedAt()
                        ))
                        .toList(),
                "recentComments", user.getComments().stream()
                        .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                        .limit(5)
                        .map(comment -> java.util.Map.of(
                                "id", comment.getId(),
                                "content", comment.getContent(),
                                "taskId", comment.getTask().getId(),
                                "createdAt", comment.getCreatedAt()
                        ))
                        .toList(),
                "recentTimeLogs", user.getTimeLogs().stream()
                        .sorted((t1, t2) -> t2.getWorkDate().compareTo(t1.getWorkDate()))
                        .limit(5)
                        .map(timeLog -> java.util.Map.of(
                                "id", timeLog.getId(),
                                "description", timeLog.getDescription() != null ? timeLog.getDescription() : "",
                                "hours", timeLog.getHoursWorked(),
                                "workDate", timeLog.getWorkDate()
                        ))
                        .toList()
        );
    }
}