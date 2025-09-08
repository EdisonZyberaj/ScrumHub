package dev.scrumHub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SprintResponseDto {
    private Long id;
    private String name;
    private String goal;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Long projectId;
    private String projectName;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer progress;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}