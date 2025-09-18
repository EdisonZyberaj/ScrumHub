package dev.scrumHub.controller;

import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.service.TaskService;
import dev.scrumHub.service.ProjectService;
import dev.scrumHub.service.UserService;
import dev.scrumHub.service.TaskCommentService;
import dev.scrumHub.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/scrum-master")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ScrumMasterController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserService userService;
    private final TaskCommentService commentService;

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long projectId) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> allTasks;
        if (projectId != null) {
            allTasks = taskService.getTasksByProjectId(projectId);
        } else {
            allTasks = new ArrayList<>();
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", allTasks.size());
        stats.put("completed", allTasks.stream().filter(t -> "DONE".equals(t.getStatus())).count());
        stats.put("inProgress", allTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count());
        stats.put("blocked", allTasks.stream().filter(t -> "BUG_FOUND".equals(t.getStatus())).count());
        stats.put("toDo", allTasks.stream().filter(t -> "TO_DO".equals(t.getStatus())).count());
        stats.put("readyForTesting", allTasks.stream().filter(t -> "READY_FOR_TESTING".equals(t.getStatus())).count());
        stats.put("inTesting", allTasks.stream().filter(t -> "IN_TESTING".equals(t.getStatus())).count());
        stats.put("testPassed", allTasks.stream().filter(t -> "TEST_PASSED".equals(t.getStatus())).count());

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/tasks/{taskId}/status")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> statusRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            String newStatusStr = statusRequest.get("status");
            if (newStatusStr == null || newStatusStr.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Status is required"));
            }

            try {
                dev.scrumHub.model.Task.TaskStatus.valueOf(newStatusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid status: " + newStatusStr));
            }

            TaskResponseDto currentTask = taskService.getTaskById(taskId);
            String oldStatus = currentTask.getStatus();

            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            TaskResponseDto updatedTask = taskService.updateTaskStatus(taskId,
                    dev.scrumHub.model.Task.TaskStatus.valueOf(newStatusStr.toUpperCase()));

            if (!oldStatus.equals(updatedTask.getStatus())) {
                commentService.createStatusChangeComment(taskId, oldStatus, updatedTask.getStatus(), currentUser);
            }

            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/tasks")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<TaskResponseDto>> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId) {

        List<TaskResponseDto> tasks;

        if (sprintId != null) {
            tasks = taskService.getTasksBySprintId(sprintId);
        } else if (projectId != null) {
            tasks = taskService.getTasksByProjectId(projectId);
        } else {
            tasks = new ArrayList<>();
        }

        if (status != null && !status.trim().isEmpty()) {
            tasks = tasks.stream()
                    .filter(task -> status.equalsIgnoreCase(task.getStatus()))
                    .toList();
        }

        return ResponseEntity.ok(tasks);
    }
}