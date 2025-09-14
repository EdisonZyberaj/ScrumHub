package dev.scrumHub.controller;

import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.service.TaskService;
import dev.scrumHub.service.ProjectService;
import dev.scrumHub.service.UserService;
import dev.scrumHub.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DeveloperController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserService userService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> userTasks = taskService.getTasksByAssigneeId(user.getId());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", userTasks.size());
        stats.put("completed", userTasks.stream().filter(t -> "DONE".equals(t.getStatus())).count());
        stats.put("inProgress", userTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count());
        stats.put("blocked", userTasks.stream().filter(t -> "BUG_FOUND".equals(t.getStatus())).count());
        stats.put("toDo", userTasks.stream().filter(t -> "TO_DO".equals(t.getStatus())).count());
        stats.put("readyForTesting", userTasks.stream().filter(t -> "READY_FOR_TESTING".equals(t.getStatus())).count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponseDto>> getMyTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> tasks;

        if (sprintId != null) {
            tasks = taskService.getTasksBySprintIdAndAssigneeId(sprintId, user.getId());
        } else if (projectId != null) {
            tasks = taskService.getTasksByProjectIdAndAssigneeId(projectId, user.getId());
        } else {
            tasks = taskService.getTasksByAssigneeId(user.getId());
        }

        // Filter by status if provided
        if (status != null && !status.trim().isEmpty()) {
            tasks = tasks.stream()
                    .filter(task -> status.equalsIgnoreCase(task.getStatus()))
                    .toList();
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/current-sprint")
    public ResponseEntity<List<TaskResponseDto>> getCurrentSprintTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long projectId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> tasks = taskService.getCurrentSprintTasksForUser(user.getId(), projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<?> updateMyTaskStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> statusRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            String statusStr = statusRequest.get("status");
            if (statusStr == null || statusStr.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Status is required"));
            }

            // Validate that this task is assigned to the current user
            TaskResponseDto task = taskService.getTaskById(taskId);
            if (task.getAssigneeId() == null || !task.getAssigneeId().equals(user.getId())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "You can only update status of tasks assigned to you"));
            }

            // Validate developer-allowed status transitions
            if (!isValidDeveloperStatusTransition(task.getStatus(), statusStr)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid status transition from " + task.getStatus() + " to " + statusStr));
            }

            TaskResponseDto updatedTask = taskService.updateTaskStatus(taskId,
                    dev.scrumHub.model.Task.TaskStatus.valueOf(statusStr.toUpperCase()));
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid status: " + statusRequest.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    private boolean isValidDeveloperStatusTransition(String currentStatus, String newStatus) {
        // Developers can transition:
        // TO_DO -> IN_PROGRESS
        // IN_PROGRESS -> READY_FOR_TESTING
        // BUG_FOUND -> IN_PROGRESS
        // IN_PROGRESS -> TO_DO (if they need to step back)

        switch (currentStatus) {
            case "TO_DO":
                return "IN_PROGRESS".equals(newStatus);
            case "IN_PROGRESS":
                return "READY_FOR_TESTING".equals(newStatus) || "TO_DO".equals(newStatus);
            case "BUG_FOUND":
                return "IN_PROGRESS".equals(newStatus);
            case "READY_FOR_TESTING":
                return "IN_PROGRESS".equals(newStatus); // Can pull back from testing if needed
            default:
                return false;
        }
    }
}