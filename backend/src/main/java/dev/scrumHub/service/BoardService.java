package dev.scrumHub.service;

import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.dto.UserResponseDto;
import dev.scrumHub.model.Task;
import dev.scrumHub.model.User;
import dev.scrumHub.repository.TaskRepository;
import dev.scrumHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskService taskService;

    public Map<String, List<TaskResponseDto>> getDeveloperBoard(Long projectId, Long sprintId, Long developerId) {
        List<Task> tasks;
        
        if (developerId != null) {
            tasks = taskRepository.findByAssigneeIdAndSprintId(developerId, sprintId);
        } else if (sprintId != null) {
            tasks = taskRepository.findBySprintIdOrderByPriorityDesc(sprintId);
        } else if (projectId != null) {
            tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        } else {
            tasks = new ArrayList<>();
        }

        // Filter tasks relevant for developers
        List<Task> developerTasks = tasks.stream()
                .filter(task -> {
                    if (task.getAssignee() == null) return false;
                    return task.getAssignee().getRole() == User.UserRole.DEVELOPER;
                })
                .collect(Collectors.toList());

        return groupTasksByStatus(developerTasks);
    }

    public Map<String, List<TaskResponseDto>> getTesterBoard(Long projectId, Long sprintId, Long testerId) {
        List<Task> tasks;
        
        if (testerId != null) {
            tasks = taskRepository.findByAssigneeIdAndSprintId(testerId, sprintId);
        } else if (sprintId != null) {
            tasks = taskRepository.findBySprintIdOrderByPriorityDesc(sprintId);
        } else if (projectId != null) {
            tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        } else {
            tasks = new ArrayList<>();
        }

        // Filter tasks relevant for testers
        List<Task> testerTasks = tasks.stream()
                .filter(task -> {
                    // Include tasks ready for testing or assigned to testers
                    return task.getStatus() == Task.TaskStatus.READY_FOR_TESTING ||
                           task.getStatus() == Task.TaskStatus.IN_TESTING ||
                           task.getStatus() == Task.TaskStatus.BUG_FOUND ||
                           task.getStatus() == Task.TaskStatus.TEST_PASSED ||
                           (task.getAssignee() != null && task.getAssignee().getRole() == User.UserRole.TESTER);
                })
                .collect(Collectors.toList());

        return groupTasksByStatus(testerTasks);
    }

    public Map<String, Object> getScrumMasterBoard(Long projectId, Long sprintId) {
        List<Task> tasks;
        
        if (sprintId != null) {
            tasks = taskRepository.findBySprintIdOrderByPriorityDesc(sprintId);
        } else if (projectId != null) {
            tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        } else {
            tasks = new ArrayList<>();
        }

        Map<String, Object> boardData = new HashMap<>();
        
        // Group tasks by status
        Map<String, List<TaskResponseDto>> tasksByStatus = groupTasksByStatus(tasks);
        boardData.put("tasksByStatus", tasksByStatus);
        
        // Group tasks by assignee
        Map<String, List<TaskResponseDto>> tasksByAssignee = groupTasksByAssignee(tasks);
        boardData.put("tasksByAssignee", tasksByAssignee);
        
        // Add summary statistics
        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalTasks", tasks.size());
        stats.put("completedTasks", (int) tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.DONE).count());
        stats.put("inProgressTasks", (int) tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.IN_PROGRESS).count());
        stats.put("unassignedTasks", (int) tasks.stream().filter(t -> t.getAssignee() == null).count());
        boardData.put("stats", stats);
        
        return boardData;
    }

    public Map<String, List<TaskResponseDto>> getTasksByStatusForProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        return groupTasksByStatus(tasks);
    }

    public Map<String, List<TaskResponseDto>> getTasksByAssigneeForProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        return groupTasksByAssignee(tasks);
    }

    private Map<String, List<TaskResponseDto>> groupTasksByStatus(List<Task> tasks) {
        Map<String, List<TaskResponseDto>> grouped = new LinkedHashMap<>();
        
        // Initialize all status groups
        grouped.put("TO_DO", new ArrayList<>());
        grouped.put("IN_PROGRESS", new ArrayList<>());
        grouped.put("READY_FOR_TESTING", new ArrayList<>());
        grouped.put("IN_TESTING", new ArrayList<>());
        grouped.put("BUG_FOUND", new ArrayList<>());
        grouped.put("TEST_PASSED", new ArrayList<>());
        grouped.put("DONE", new ArrayList<>());
        
        // Group tasks by status
        for (Task task : tasks) {
            String status = task.getStatus().toString();
            TaskResponseDto taskDto = taskService.convertToDto(task);
            grouped.get(status).add(taskDto);
        }
        
        return grouped;
    }

    private Map<String, List<TaskResponseDto>> groupTasksByAssignee(List<Task> tasks) {
        Map<String, List<TaskResponseDto>> grouped = new LinkedHashMap<>();
        
        // Add unassigned tasks first
        List<TaskResponseDto> unassignedTasks = tasks.stream()
                .filter(task -> task.getAssignee() == null)
                .map(taskService::convertToDto)
                .collect(Collectors.toList());
        if (!unassignedTasks.isEmpty()) {
            grouped.put("Unassigned", unassignedTasks);
        }
        
        // Group by assignee
        Map<User, List<Task>> tasksByUser = tasks.stream()
                .filter(task -> task.getAssignee() != null)
                .collect(Collectors.groupingBy(Task::getAssignee));
        
        for (Map.Entry<User, List<Task>> entry : tasksByUser.entrySet()) {
            String assigneeName = entry.getKey().getFullName();
            List<TaskResponseDto> userTasks = entry.getValue().stream()
                    .map(taskService::convertToDto)
                    .collect(Collectors.toList());
            grouped.put(assigneeName, userTasks);
        }
        
        return grouped;
    }
}