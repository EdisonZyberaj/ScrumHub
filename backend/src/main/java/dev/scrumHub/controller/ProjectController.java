package dev.scrumHub.controller;

import dev.scrumHub.dto.CreateProjectRequestDto;
import dev.scrumHub.dto.ProjectDto;
import dev.scrumHub.dto.ProjectResponseDto;
import dev.scrumHub.service.ProjectService;
import lombok.RequiredArgsConstructor; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponseDto>> getAllProjects(
            @RequestParam(defaultValue = "true") boolean activeOnly,
            @RequestParam(required = false) Long userId) {
        List<ProjectResponseDto> projects;

        if (userId != null) {
            // Get projects for specific user
            if (activeOnly) {
                projects = projectService.getActiveProjectsForUser(userId);
            } else {
                projects = projectService.getAllProjectsForUser(userId);
            }
        } else {
            // Get all projects
            if (activeOnly) {
                projects = projectService.getAllActiveProjectsWithStats();
            } else {
                projects = projectService.getAllProjectsWithStats();
            }
        }
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(project -> ResponseEntity.ok(project))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<ProjectDto> getProjectByKey(@PathVariable String key) {
        return projectService.getProjectByKey(key)
                .map(project -> ResponseEntity.ok(project))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> createProject(@Valid @RequestBody CreateProjectRequestDto requestDto) {
        try {
            ProjectResponseDto createdProject = projectService.createProjectFromRequest(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> updateProject(
            @PathVariable Long id, 
            @Valid @RequestBody ProjectDto projectDto) {
        try {
            ProjectDto updatedProject = projectService.updateProject(id, projectDto);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> updateProjectStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusRequest) {
        try {
            String status = statusRequest.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Status is required"));
            }
            ProjectResponseDto updatedProject = projectService.updateProjectStatus(id, status);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> hardDeleteProject(@PathVariable Long id) {
        try {
            projectService.hardDeleteProject(id);
            return ResponseEntity.ok(Map.of("message", "Project permanently deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/check-name")
    public ResponseEntity<Map<String, Boolean>> checkProjectName(@RequestParam String name) {
        boolean exists = projectService.existsByName(name);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-key")
    public ResponseEntity<Map<String, Boolean>> checkProjectKey(@RequestParam String key) {
        boolean exists = projectService.existsByKey(key);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @PostMapping("/{projectId}/members")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> addProjectMember(
            @PathVariable Long projectId,
            @RequestBody Map<String, Object> memberRequest) {
        try {
            Long userId = Long.valueOf(memberRequest.get("userId").toString());
            String roleInProject = memberRequest.get("roleInProject").toString();
            
            projectService.addProjectMember(projectId, userId, roleInProject);
            return ResponseEntity.ok(Map.of("message", "Member added successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> removeProjectMember(
            @PathVariable Long projectId,
            @PathVariable Long userId) {
        try {
            projectService.removeProjectMember(projectId, userId);
            return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}