package dev.scrumHub.service;

import dev.scrumHub.dto.TaskResponseDto;
import dev.scrumHub.dto.ProjectResponseDto;
import dev.scrumHub.model.*;
import dev.scrumHub.model.Task.TaskStatus;
import dev.scrumHub.repository.TaskRepository;
import dev.scrumHub.repository.ProjectRepository;
import dev.scrumHub.repository.UserRepository;
import dev.scrumHub.repository.UserProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TesterService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserProjectRepository userProjectRepository;
    private final TaskService taskService;

    public Map<String, Object> getTesterStats(Long testerId) {
        // Get all tasks in projects where the tester is involved
        List<Task> allProjectTasks = getTasksForTesterProjects(testerId);

        // Filter for testing-related tasks
        List<Task> testingTasks = allProjectTasks.stream()
                .filter(task -> isTestingRelatedStatus(task.getStatus()))
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", testingTasks.size());
        stats.put("readyForTesting", testingTasks.stream().filter(t -> t.getStatus() == TaskStatus.READY_FOR_TESTING).count());
        stats.put("inTesting", testingTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_TESTING).count());
        stats.put("testPassed", testingTasks.stream().filter(t -> t.getStatus() == TaskStatus.TEST_PASSED).count());
        stats.put("bugFound", testingTasks.stream().filter(t -> t.getStatus() == TaskStatus.BUG_FOUND).count());

        // Additional stats
        stats.put("totalBugs", testingTasks.stream().filter(t -> t.getStatus() == TaskStatus.BUG_FOUND).count());
        stats.put("resolvedBugs", 0); // This would require additional tracking

        return stats;
    }

    public List<TaskResponseDto> getTestingTasks(Long testerId, String status, Long projectId, Long sprintId) {
        List<Task> tasks;

        if (sprintId != null) {
            // Get all tasks in the sprint (tester should see full workflow)
            tasks = taskRepository.findBySprintIdOrderByPriorityDesc(sprintId);
        } else if (projectId != null) {
            // Get all tasks in the project
            tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        } else {
            // Get tasks from all projects where tester is involved
            tasks = getTasksForTesterProjects(testerId);
        }

        // Filter by status if provided
        if (status != null && !status.trim().isEmpty()) {
            TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
            tasks = tasks.stream()
                    .filter(task -> task.getStatus() == taskStatus)
                    .collect(Collectors.toList());
        }

        return tasks.stream()
                .map(taskService::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskResponseDto> getTasksReadyForTesting(Long testerId, Long projectId) {
        List<Task> tasks;

        if (projectId != null) {
            tasks = taskRepository.findByProjectIdAndStatus(projectId, TaskStatus.READY_FOR_TESTING);
        } else {
            tasks = getTasksForTesterProjects(testerId).stream()
                    .filter(task -> task.getStatus() == TaskStatus.READY_FOR_TESTING)
                    .collect(Collectors.toList());
        }

        return tasks.stream()
                .map(taskService::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskResponseDto> getTasksInTesting(Long testerId, Long projectId) {
        List<Task> tasks;

        if (projectId != null) {
            tasks = taskRepository.findByProjectIdAndStatus(projectId, TaskStatus.IN_TESTING);
        } else {
            tasks = getTasksForTesterProjects(testerId).stream()
                    .filter(task -> task.getStatus() == TaskStatus.IN_TESTING)
                    .collect(Collectors.toList());
        }

        return tasks.stream()
                .map(taskService::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponseDto startTesting(Long taskId, Long testerId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getStatus() != TaskStatus.READY_FOR_TESTING) {
            throw new RuntimeException("Task must be in READY_FOR_TESTING status to start testing");
        }

        // Optionally assign the task to the tester if not already assigned
        if (task.getAssignee() == null) {
            User tester = userRepository.findById(testerId)
                    .orElseThrow(() -> new RuntimeException("Tester not found"));
            task.setAssignee(tester);
        }

        task.setStatus(TaskStatus.IN_TESTING);
        Task savedTask = taskRepository.save(task);

        return taskService.convertToDto(savedTask);
    }

    @Transactional
    public TaskResponseDto passTest(Long taskId, Long testerId, String testNotes) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getStatus() != TaskStatus.IN_TESTING) {
            throw new RuntimeException("Task must be in IN_TESTING status to pass test");
        }

        task.setStatus(TaskStatus.TEST_PASSED);
        Task savedTask = taskRepository.save(task);

        // Note: In a full implementation, you might want to save test notes
        // This could be done through a separate TestResult entity

        return taskService.convertToDto(savedTask);
    }

    @Transactional
    public TaskResponseDto reportBug(Long taskId, Long testerId, Map<String, Object> bugReport) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getStatus() != TaskStatus.IN_TESTING) {
            throw new RuntimeException("Task must be in IN_TESTING status to report bug");
        }

        task.setStatus(TaskStatus.BUG_FOUND);
        Task savedTask = taskRepository.save(task);

        // Note: In a full implementation, you might want to create a BugReport entity
        // For now, we'll just change the status and could store bug details in TaskComment

        return taskService.convertToDto(savedTask);
    }

    public List<Map<String, Object>> getTesterProjects(Long testerId) {
        List<UserProject> userProjects = userProjectRepository.findByUserId(testerId);

        return userProjects.stream()
                .map(up -> {
                    Project project = up.getProject();
                    Map<String, Object> projectInfo = new HashMap<>();
                    projectInfo.put("id", project.getId());
                    projectInfo.put("name", project.getName());
                    projectInfo.put("description", project.getDescription());
                    projectInfo.put("status", project.getStatus());
                    projectInfo.put("roleInProject", up.getRoleInProject());

                    // Add testing-specific statistics
                    List<Task> projectTasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(project.getId());
                    long testingTasks = projectTasks.stream()
                            .filter(task -> isTestingRelatedStatus(task.getStatus()))
                            .count();
                    projectInfo.put("testingTasks", testingTasks);

                    return projectInfo;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getTesterBoard(Long testerId, Long projectId, Long sprintId) {
        List<Task> tasks;

        if (sprintId != null) {
            tasks = taskRepository.findBySprintIdOrderByPriorityDesc(sprintId);
        } else if (projectId != null) {
            tasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        } else {
            tasks = getTasksForTesterProjects(testerId);
        }

        Map<String, Object> boardData = new HashMap<>();

        // Group tasks by status for both scrum and testing boards
        Map<String, List<TaskResponseDto>> tasksByStatus = groupTasksByStatus(tasks);
        boardData.put("tasksByStatus", tasksByStatus);

        // Add tester-specific statistics
        Map<String, Integer> stats = new HashMap<>();
        stats.put("totalTasks", tasks.size());
        stats.put("readyForTesting", (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.READY_FOR_TESTING).count());
        stats.put("inTesting", (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_TESTING).count());
        stats.put("testPassed", (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.TEST_PASSED).count());
        stats.put("bugFound", (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.BUG_FOUND).count());
        boardData.put("stats", stats);

        return boardData;
    }

    private List<Task> getTasksForTesterProjects(Long testerId) {
        List<UserProject> userProjects = userProjectRepository.findByUserId(testerId);
        List<Task> allTasks = new ArrayList<>();

        for (UserProject userProject : userProjects) {
            List<Task> projectTasks = taskRepository.findByProjectIdOrderByCreatedAtDesc(userProject.getProject().getId());
            allTasks.addAll(projectTasks);
        }

        return allTasks;
    }

    private boolean isTestingRelatedStatus(TaskStatus status) {
        return status == TaskStatus.READY_FOR_TESTING ||
               status == TaskStatus.IN_TESTING ||
               status == TaskStatus.BUG_FOUND ||
               status == TaskStatus.TEST_PASSED;
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
}