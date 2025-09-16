package dev.scrumHub.controller;

import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.service.TaskService;
import dev.scrumHub.service.ProjectService;
import dev.scrumHub.service.UserService;
import dev.scrumHub.service.TesterService;
import dev.scrumHub.model.User;
import dev.scrumHub.model.Task.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tester")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TesterController {

    private final TaskService taskService;
    private final ProjectService projectService;
    private final UserService userService;
    private final TesterService testerService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getTesterDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = testerService.getTesterStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskResponseDto>> getTestingTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> tasks = testerService.getTestingTasks(user.getId(), status, projectId, sprintId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/ready-for-testing")
    public ResponseEntity<List<TaskResponseDto>> getTasksReadyForTesting(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long projectId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> tasks = testerService.getTasksReadyForTesting(user.getId(), projectId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/in-testing")
    public ResponseEntity<List<TaskResponseDto>> getTasksInTesting(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long projectId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TaskResponseDto> tasks = testerService.getTasksInTesting(user.getId(), projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(
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

            // Validate tester-allowed status transitions
            TaskResponseDto task = taskService.getTaskById(taskId);
            if (!isValidTesterStatusTransition(task.getStatus(), statusStr)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Invalid status transition from " + task.getStatus() + " to " + statusStr));
            }

            TaskResponseDto updatedTask = taskService.updateTaskStatus(taskId, TaskStatus.valueOf(statusStr.toUpperCase()));
            return ResponseEntity.ok(updatedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid status: " + statusRequest.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/tasks/{taskId}/start-testing")
    public ResponseEntity<?> startTesting(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            TaskResponseDto updatedTask = testerService.startTesting(taskId, user.getId());
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/tasks/{taskId}/pass-test")
    public ResponseEntity<?> passTest(
            @PathVariable Long taskId,
            @RequestBody(required = false) Map<String, String> testNotes,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            String notes = testNotes != null ? testNotes.get("notes") : null;
            TaskResponseDto updatedTask = testerService.passTest(taskId, user.getId(), notes);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/tasks/{taskId}/report-bug")
    public ResponseEntity<?> reportBug(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> bugReport,
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            TaskResponseDto updatedTask = testerService.reportBug(taskId, user.getId(), bugReport);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getTesterProjects(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Map<String, Object>> projects = testerService.getTesterProjects(user.getId());
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/board")
    public ResponseEntity<Map<String, Object>> getTesterBoard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> boardData = testerService.getTesterBoard(user.getId(), projectId, sprintId);
        return ResponseEntity.ok(boardData);
    }

    private boolean isValidTesterStatusTransition(String currentStatus, String newStatus) {
        // Testers can transition:
        // READY_FOR_TESTING -> IN_TESTING
        // IN_TESTING -> TEST_PASSED
        // IN_TESTING -> BUG_FOUND
        // BUG_FOUND -> IN_TESTING (retest after bug fix)
        // TEST_PASSED -> IN_TESTING (reopen if needed)

        switch (currentStatus) {
            case "READY_FOR_TESTING":
                return "IN_TESTING".equals(newStatus);
            case "IN_TESTING":
                return "TEST_PASSED".equals(newStatus) || "BUG_FOUND".equals(newStatus);
            case "BUG_FOUND":
                return "IN_TESTING".equals(newStatus);
            case "TEST_PASSED":
                return "IN_TESTING".equals(newStatus) || "DONE".equals(newStatus);
            default:
                return false;
        }
    }
}