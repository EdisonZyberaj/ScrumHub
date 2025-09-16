package dev.scrumHub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsDto {
    private Long totalAssignedTasks;
    private Long completedTasks;
    private Long activeTasks;
    private Long totalProjectsJoined;
    private Long totalBugsReported;
    private Long totalBugsAssigned;
    private Long totalTestCasesCreated;
    private LocalDateTime lastLogin;
    private LocalDateTime memberSince;
}