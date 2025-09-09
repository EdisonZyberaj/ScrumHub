package dev.scrumHub.controller;

import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/developer")
    public ResponseEntity<Map<String, List<TaskResponseDto>>> getDeveloperBoard(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId,
            @RequestParam(required = false) Long developerId) {
        
        Map<String, List<TaskResponseDto>> boardData = boardService.getDeveloperBoard(projectId, sprintId, developerId);
        return ResponseEntity.ok(boardData);
    }

    @GetMapping("/tester")
    public ResponseEntity<Map<String, List<TaskResponseDto>>> getTesterBoard(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId,
            @RequestParam(required = false) Long testerId) {
        
        Map<String, List<TaskResponseDto>> boardData = boardService.getTesterBoard(projectId, sprintId, testerId);
        return ResponseEntity.ok(boardData);
    }

    @GetMapping("/scrum-master")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<Map<String, Object>> getScrumMasterBoard(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long sprintId) {
        
        Map<String, Object> boardData = boardService.getScrumMasterBoard(projectId, sprintId);
        return ResponseEntity.ok(boardData);
    }

    @GetMapping("/project/{projectId}/tasks-by-status")
    public ResponseEntity<Map<String, List<TaskResponseDto>>> getTasksByStatus(@PathVariable Long projectId) {
        Map<String, List<TaskResponseDto>> tasksByStatus = boardService.getTasksByStatusForProject(projectId);
        return ResponseEntity.ok(tasksByStatus);
    }

    @GetMapping("/project/{projectId}/tasks-by-assignee")
    public ResponseEntity<Map<String, List<TaskResponseDto>>> getTasksByAssignee(@PathVariable Long projectId) {
        Map<String, List<TaskResponseDto>> tasksByAssignee = boardService.getTasksByAssigneeForProject(projectId);
        return ResponseEntity.ok(tasksByAssignee);
    }
}