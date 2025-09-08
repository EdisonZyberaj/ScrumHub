package dev.scrumHub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private String acceptanceCriteria;
    private String type;
    private String priority;
    private String status;
    private Integer estimatedHours;
    private Integer loggedHours;
    private LocalDateTime dueDate;
    private Long sprintId;
    private String sprintName;
    private Long projectId;
    private String projectName;
    private Long assigneeId;
    private UserResponseDto assignee;
    private UserResponseDto createdBy;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}