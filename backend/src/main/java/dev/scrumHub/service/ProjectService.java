package dev.scrumHub.service;

import dev.scrumHub.dto.CreateProjectRequestDto;
import dev.scrumHub.dto.ProjectDto;
import dev.scrumHub.dto.ProjectResponseDto;
import dev.scrumHub.model.Project;
import dev.scrumHub.model.Sprint;
import dev.scrumHub.model.Task;
import dev.scrumHub.model.Task.TaskStatus;
import dev.scrumHub.model.User;
import dev.scrumHub.model.UserProject;
import dev.scrumHub.model.UserProjectId;
import dev.scrumHub.repository.ProjectRepository;
import dev.scrumHub.repository.SprintRepository;
import dev.scrumHub.repository.TaskRepository;
import dev.scrumHub.repository.UserRepository;
import dev.scrumHub.repository.UserProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final UserProjectRepository userProjectRepository;

    public List<ProjectDto> getAllActiveProjects() {
        return projectRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProjectResponseDto> getAllActiveProjectsWithStats() {
        return projectRepository.findByActiveTrue()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<ProjectResponseDto> getAllProjectsWithStats() {
        return projectRepository.findAll()
                .stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ProjectDto> getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::convertToDto);
    }

    public Optional<ProjectDto> getProjectByKey(String key) {
        return projectRepository.findByKey(key)
                .map(this::convertToDto);
    }

    @Transactional
    public ProjectDto createProject(ProjectDto projectDto) {
        if (projectRepository.existsByName(projectDto.getName())) {
            throw new RuntimeException("Project with name '" + projectDto.getName() + "' already exists");
        }
        
        if (projectRepository.existsByKey(projectDto.getKey())) {
            throw new RuntimeException("Project with key '" + projectDto.getKey() + "' already exists");
        }

        Project project = convertToEntity(projectDto);
        project.setActive(true);
        project.setStatus(Project.ProjectStatus.ACTIVE);
        
        Project savedProject = projectRepository.save(project);
        return convertToDto(savedProject);
    }
    
    @Transactional
    public ProjectResponseDto createProjectFromRequest(CreateProjectRequestDto requestDto) {
        if (projectRepository.existsByName(requestDto.getName())) {
            throw new RuntimeException("Project with name '" + requestDto.getName() + "' already exists");
        }
        
        if (projectRepository.existsByKey(requestDto.getKey())) {
            throw new RuntimeException("Project with key '" + requestDto.getKey() + "' already exists");
        }

        Project project = Project.builder()
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .key(requestDto.getKey())
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .active(true)
                .status(Project.ProjectStatus.ACTIVE)
                .build();
        
        Project savedProject = projectRepository.save(project);
        return convertToResponseDto(savedProject);
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        // Check if name or key conflicts with other projects
        if (!existingProject.getName().equals(projectDto.getName()) && 
            projectRepository.existsByName(projectDto.getName())) {
            throw new RuntimeException("Project with name '" + projectDto.getName() + "' already exists");
        }
        
        if (!existingProject.getKey().equals(projectDto.getKey()) && 
            projectRepository.existsByKey(projectDto.getKey())) {
            throw new RuntimeException("Project with key '" + projectDto.getKey() + "' already exists");
        }

        // Update fields
        existingProject.setName(projectDto.getName());
        existingProject.setDescription(projectDto.getDescription());
        existingProject.setKey(projectDto.getKey());
        existingProject.setStartDate(projectDto.getStartDate());
        existingProject.setEndDate(projectDto.getEndDate());
        existingProject.setActive(projectDto.isActive());
        
        // Update status if provided
        if (projectDto.getStatus() != null) {
            try {
                String normalizedStatus = projectDto.getStatus().toLowerCase().replace("-", "_");
                Project.ProjectStatus status = Project.ProjectStatus.valueOf(normalizedStatus.toUpperCase());
                existingProject.setStatus(status);
            } catch (IllegalArgumentException e) {
                // Keep existing status if invalid status provided
            }
        }

        Project updatedProject = projectRepository.save(existingProject);
        return convertToDto(updatedProject);
    }

    @Transactional
    public ProjectResponseDto updateProjectStatus(Long id, String status) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        // Parse and validate status
        Project.ProjectStatus projectStatus;
        try {
            String normalizedStatus = status.toLowerCase().replace("-", "_");
            projectStatus = Project.ProjectStatus.valueOf(normalizedStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status + ". Valid values are: active, completed, on-hold, planned");
        }
        
        // Update project status
        project.setStatus(projectStatus);
        
        // Update project active status based on the status
        switch (projectStatus) {
            case ACTIVE:
            case PLANNED:
                project.setActive(true);
                break;
            case COMPLETED:
            case ON_HOLD:
                project.setActive(false);
                break;
        }
        
        Project updatedProject = projectRepository.save(project);
        return convertToResponseDto(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        
        // Soft delete by setting active to false
        project.setActive(false);
        projectRepository.save(project);
    }

    @Transactional
    public void hardDeleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public boolean existsByName(String name) {
        return projectRepository.existsByName(name);
    }

    public boolean existsByKey(String key) {
        return projectRepository.existsByKey(key);
    }

    private ProjectDto convertToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .key(project.getKey())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .active(project.isActive())
                .status(convertStatusToString(project.getStatus()))
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private Project convertToEntity(ProjectDto projectDto) {
        return Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .key(projectDto.getKey())
                .startDate(projectDto.getStartDate())
                .endDate(projectDto.getEndDate())
                .active(projectDto.isActive())
                .build();
    }
    
    private ProjectResponseDto convertToResponseDto(Project project) {
        // Calculate stats
        List<Sprint> sprints = sprintRepository.findByProjectId(project.getId());
        long totalTasks = taskRepository.countByProjectId(project.getId());
        long completedTasks = taskRepository.countByProjectIdAndStatus(project.getId(), TaskStatus.DONE);
        
        // Use the actual stored status instead of calculating it
        String status = convertStatusToString(project.getStatus());
        
        // Handle null collections safely and avoid ConcurrentModificationException
        // Use repository to count members instead of accessing lazy-loaded collection
        long memberCount = userProjectRepository.countByProjectId(project.getId());
        int sprintCount = (sprints != null) ? sprints.size() : 0;
        
        return ProjectResponseDto.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .key(project.getKey())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .active(project.isActive())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .memberCount((int) memberCount)
                .sprintCount(sprintCount)
                .completedTasks((int) completedTasks)
                .totalTasks((int) totalTasks)
                .status(status)
                .build();
    }
    
    private String convertStatusToString(Project.ProjectStatus status) {
        if (status == null) {
            return "active";
        }
        return status.name().toLowerCase().replace("_", "-");
    }
    
    @Transactional
    public void migrateProjectStatuses() {
        try {
            List<Project> allProjects = projectRepository.findAll();
            List<Project> projectsToUpdate = new ArrayList<>();
            
            for (Project project : allProjects) {
                if (project.getStatus() == null) {
                    // Set status based on active field for existing projects
                    if (project.isActive()) {
                        project.setStatus(Project.ProjectStatus.ACTIVE);
                    } else {
                        project.setStatus(Project.ProjectStatus.COMPLETED);
                    }
                    projectsToUpdate.add(project);
                }
            }
            
            if (!projectsToUpdate.isEmpty()) {
                projectRepository.saveAll(projectsToUpdate);
            }
        } catch (Exception e) {
            // Don't fail the application startup due to migration issues
            System.err.println("Warning: Project status migration failed: " + e.getMessage());
        }
    }
    
    @Transactional
    public void addProjectMember(Long projectId, Long userId, String roleInProject) {
        // Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Check if user is already a member of this project
        UserProjectId userProjectId = new UserProjectId(userId, projectId);
        if (userProjectRepository.existsById(userProjectId)) {
            throw new RuntimeException("User is already a member of this project");
        }
        
        // Parse and validate role
        UserProject.ProjectRole role;
        try {
            role = UserProject.ProjectRole.valueOf(roleInProject.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleInProject);
        }
        
        // Create user-project relationship
        UserProject userProject = UserProject.builder()
                .id(userProjectId)
                .user(user)
                .project(project)
                .roleInProject(role)
                .build();
        
        userProjectRepository.save(userProject);
    }
    
    @Transactional
    public void removeProjectMember(Long projectId, Long userId) {
        // Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Check if user is a member of this project
        UserProjectId userProjectId = new UserProjectId(userId, projectId);
        UserProject userProject = userProjectRepository.findById(userProjectId)
                .orElseThrow(() -> new RuntimeException("User is not a member of this project"));
        
        // Don't allow removing scrum masters
        if (userProject.getRoleInProject() == UserProject.ProjectRole.SCRUM_MASTER) {
            throw new RuntimeException("Cannot remove Scrum Master from project");
        }
        
        userProjectRepository.deleteById(userProjectId);
    }
}