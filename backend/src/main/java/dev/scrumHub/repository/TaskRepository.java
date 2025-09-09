package dev.scrumHub.repository;

import dev.scrumHub.model.Task;
import dev.scrumHub.model.Task.TaskPriority;
import dev.scrumHub.model.Task.TaskStatus;
import dev.scrumHub.model.Task.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findBySprintId(Long sprintId);
    List<Task> findByAssigneeId(Long assigneeId);
    List<Task> findByCreatedById(Long createdById);
    List<Task> findByProjectIdAndType(Long projectId, TaskType type);
    List<Task> findByProjectIdAndPriority(Long projectId, TaskPriority priority);
    List<Task> findBySprintIdOrderByPriorityDesc(Long sprintId);
    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    long countByProjectId(Long projectId);
    long countBySprintId(Long sprintId);
    long countBySprintIdAndStatus(Long sprintId, TaskStatus status);
    long countByProjectIdAndStatus(Long projectId, TaskStatus status);
    List<Task> findBySprintIdAndStatus(Long sprintId, TaskStatus status);
    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);
    List<Task> findByAssigneeIdAndSprintId(Long assigneeId, Long sprintId);
}