package dev.scrumHub.service;

import dev.scrumHub.dto.CreateTaskRequestDto;
import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.dto.AssignTaskRequestDto;
import dev.scrumHub.dto.UserResponseDto;
import dev.scrumHub.model.*;
import dev.scrumHub.model.Task.TaskPriority;
import dev.scrumHub.model.Task.TaskStatus;
import dev.scrumHub.model.Task.TaskType;
import dev.scrumHub.repository.ProjectRepository;
import dev.scrumHub.repository.SprintRepository;
import dev.scrumHub.repository.TaskRepository;
import dev.scrumHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;

    public List<TaskResponseDto> getTasksByProjectId(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskResponseDto> getTasksBySprintId(Long sprintId) {
        List<Task> tasks = taskRepository.findBySprintIdOrderByPriorityDesc(sprintId);
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TaskResponseDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        return convertToDto(task);
    }

    @Transactional
    public TaskResponseDto createTask(CreateTaskRequestDto requestDto) {
        // Get current user from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User createdBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Check if project exists
        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + requestDto.getProjectId()));

        Sprint sprint = null;
        if (requestDto.getSprintId() != null) {
            sprint = sprintRepository.findById(requestDto.getSprintId())
                    .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + requestDto.getSprintId()));
        }

        User assignee = null;
        if (requestDto.getAssigneeId() != null) {
            assignee = userRepository.findById(requestDto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found with id: " + requestDto.getAssigneeId()));
        }

        Task task = Task.builder()
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .acceptanceCriteria(requestDto.getAcceptanceCriteria())
                .type(TaskType.valueOf(requestDto.getType().toUpperCase()))
                .priority(TaskPriority.valueOf(requestDto.getPriority().toUpperCase()))
                .status(TaskStatus.valueOf(requestDto.getStatus().toUpperCase()))
                .estimatedHours(requestDto.getEstimatedHours())
                .dueDate(requestDto.getDueDate())
                .project(project)
                .sprint(sprint)
                .assignee(assignee)
                .createdBy(createdBy)
                .loggedHours(0)
                .build();

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Transactional
    public TaskResponseDto assignTask(Long taskId, AssignTaskRequestDto requestDto) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (requestDto.getAssigneeId() != null) {
            User assignee = userRepository.findById(requestDto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found with id: " + requestDto.getAssigneeId()));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Transactional
    public TaskResponseDto updateTaskStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        task.setStatus(status);
        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));
        
        taskRepository.delete(task);
    }

    public List<TaskResponseDto> getTasksByAssigneeId(Long assigneeId) {
        List<Task> tasks = taskRepository.findByAssigneeId(assigneeId);
        return tasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TaskResponseDto convertToDto(Task task) {
        UserResponseDto assigneeDto = null;
        if (task.getAssignee() != null) {
            assigneeDto = UserResponseDto.builder()
                    .id(task.getAssignee().getId())
                    .username(task.getAssignee().getUsername())
                    .fullName(task.getAssignee().getFullName())
                    .email(task.getAssignee().getEmail())
                    .role(task.getAssignee().getRole())
                    .active(task.getAssignee().isActive())
                    .build();
        }

        UserResponseDto createdByDto = UserResponseDto.builder()
                .id(task.getCreatedBy().getId())
                .username(task.getCreatedBy().getUsername())
                .fullName(task.getCreatedBy().getFullName())
                .email(task.getCreatedBy().getEmail())
                .role(task.getCreatedBy().getRole())
                .active(task.getCreatedBy().isActive())
                .build();

        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .acceptanceCriteria(task.getAcceptanceCriteria())
                .type(task.getType().toString())
                .priority(task.getPriority().toString())
                .status(task.getStatus().toString())
                .estimatedHours(task.getEstimatedHours())
                .loggedHours(task.getLoggedHours())
                .dueDate(task.getDueDate())
                .sprintId(task.getSprint() != null ? task.getSprint().getId() : null)
                .sprintName(task.getSprint() != null ? task.getSprint().getName() : null)
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assignee(assigneeDto)
                .createdBy(createdByDto)
                .tags(generateTaskTags(task))
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private List<String> generateTaskTags(Task task) {
        List<String> tags = new ArrayList<>();
        
        // Add type-based tags
        if (task.getType() == TaskType.BUG) {
            tags.add("Bug");
        }
        
        // Add priority-based tags
        if (task.getPriority() == TaskPriority.HIGH || task.getPriority() == TaskPriority.CRITICAL) {
            tags.add("High Priority");
        }
        
        // Add status-based tags
        if (task.getStatus() == TaskStatus.IN_TESTING) {
            tags.add("Testing");
        }
        
        // Add generic tags based on keywords in title/description
        String content = (task.getTitle() + " " + (task.getDescription() != null ? task.getDescription() : "")).toLowerCase();
        
        if (content.contains("frontend") || content.contains("ui") || content.contains("interface")) {
            tags.add("Frontend");
        }
        if (content.contains("backend") || content.contains("api") || content.contains("server")) {
            tags.add("Backend");
        }
        if (content.contains("design") || content.contains("ux")) {
            tags.add("Design");
        }
        if (content.contains("security") || content.contains("auth")) {
            tags.add("Security");
        }
        if (content.contains("performance") || content.contains("optimization")) {
            tags.add("Performance");
        }
        if (content.contains("payment") || content.contains("billing")) {
            tags.add("Payment");
        }
        if (content.contains("documentation") || content.contains("docs")) {
            tags.add("Documentation");
        }
        if (content.contains("devops") || content.contains("deployment")) {
            tags.add("DevOps");
        }
        
        return tags;
    }
}