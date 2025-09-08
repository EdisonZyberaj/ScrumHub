package dev.scrumHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskRequestDto {
    @NotBlank(message = "Task title is required")
    private String title;

    private String description;
    
    private String acceptanceCriteria;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long sprintId;

    private String type = "TASK";

    private String priority = "MEDIUM";

    private String status = "TO_DO";

    private Integer estimatedHours;

    private LocalDateTime dueDate;

    private Long assigneeId;
}