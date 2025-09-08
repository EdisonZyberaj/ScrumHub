package dev.scrumHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateSprintRequestDto {
    @NotBlank(message = "Sprint name is required")
    private String name;

    @NotBlank(message = "Sprint goal is required")
    private String goal;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
}