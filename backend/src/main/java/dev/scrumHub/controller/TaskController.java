package dev.scrumHub.controller;

import dev.scrumHub.dto.AssignTaskRequestDto;
import dev.scrumHub.dto.CreateTaskRequestDto;
import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.model.Task.TaskStatus;
import dev.scrumHub.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getTasks(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId,
            @RequestParam(required = false) Long assigneeId) {
        
        List<TaskResponseDto> tasks;
        
        if (sprintId != null) {
            tasks = taskService.getTasksBySprintId(sprintId);
        } else if (projectId != null) {
            tasks = taskService.getTasksByProjectId(projectId);
        } else if (assigneeId != null) {
            tasks = taskService.getTasksByAssigneeId(assigneeId);
        } else {
            return ResponseEntity.badRequest()
                    .body(null); // At least one filter parameter is required
        }
        
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long id) {
        try {
            TaskResponseDto task = taskService.getTaskById(id);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('SCRUM_MASTER') or hasRole('DEVELOPER') or hasRole('TESTER')")
    public ResponseEntity<?> createTask(@Valid @RequestBody CreateTaskRequestDto requestDto) {
        try {
            TaskResponseDto createdTask = taskService.createTask(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> assignTask(
            @PathVariable Long id, 
            @RequestBody AssignTaskRequestDto requestDto) {
        try {
            TaskResponseDto updatedTask = taskService.assignTask(id, requestDto);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        try {
            String statusStr = statusRequest.get("status");
            if (statusStr == null || statusStr.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Status is required"));
            }
            
            TaskStatus status = TaskStatus.valueOf(statusStr.toUpperCase());
            TaskResponseDto updatedTask = taskService.updateTaskStatus(id, status);
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid status: " + statusRequest.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}