package dev.scrumHub.controller;

import dev.scrumHub.dto.CreateSprintRequestDto;
import dev.scrumHub.dto.SprintResponseDto;
import dev.scrumHub.dto.UpdateSprintStatusRequestDto;
import dev.scrumHub.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class SprintController {

    private final SprintService sprintService;

    @GetMapping
    public ResponseEntity<List<SprintResponseDto>> getSprintsByProject(
            @RequestParam Long projectId) {
        List<SprintResponseDto> sprints = sprintService.getSprintsByProjectId(projectId);
        return ResponseEntity.ok(sprints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SprintResponseDto> getSprintById(@PathVariable Long id) {
        try {
            SprintResponseDto sprint = sprintService.getSprintById(id);
            return ResponseEntity.ok(sprint);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> createSprint(@Valid @RequestBody CreateSprintRequestDto requestDto) {
        try {
            SprintResponseDto createdSprint = sprintService.createSprint(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSprint);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> updateSprintStatus(
            @PathVariable Long id, 
            @RequestBody UpdateSprintStatusRequestDto requestDto) {
        try {
            SprintResponseDto updatedSprint = sprintService.updateSprintStatus(id, requestDto);
            return ResponseEntity.ok(updatedSprint);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> deleteSprint(@PathVariable Long id) {
        try {
            sprintService.deleteSprint(id);
            return ResponseEntity.ok(Map.of("message", "Sprint deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}