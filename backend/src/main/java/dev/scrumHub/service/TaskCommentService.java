package dev.scrumHub.service;

import dev.scrumHub.model.*;
import dev.scrumHub.repository.TaskCommentRepository;
import dev.scrumHub.repository.TaskRepository;
import dev.scrumHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskComment> getCommentsByTaskId(Long taskId) {
        return taskCommentRepository.findByTaskIdOrderByCreatedAtAsc(taskId);
    }

    public List<TaskComment> getTopLevelCommentsByTaskId(Long taskId) {
        return taskCommentRepository.findTopLevelCommentsByTaskId(taskId);
    }

    public List<TaskComment> getRepliesByCommentId(Long commentId) {
        return taskCommentRepository.findByParentCommentIdOrderByCreatedAtAsc(commentId);
    }

    public TaskComment createComment(Long taskId, String content, TaskComment.CommentType type) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        User currentUser = getCurrentUser();

        TaskComment comment = TaskComment.builder()
                .content(content)
                .type(type)
                .task(task)
                .author(currentUser)
                .build();

        return taskCommentRepository.save(comment);
    }

    public TaskComment createReply(Long parentCommentId, String content) {
        TaskComment parentComment = taskCommentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + parentCommentId));

        User currentUser = getCurrentUser();

        TaskComment reply = TaskComment.builder()
                .content(content)
                .type(TaskComment.CommentType.GENERAL)
                .task(parentComment.getTask())
                .author(currentUser)
                .parentComment(parentComment)
                .build();

        return taskCommentRepository.save(reply);
    }

    public TaskComment updateComment(Long commentId, String newContent) {
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        User currentUser = getCurrentUser();

        if (!comment.getAuthor().getId().equals(currentUser.getId()) &&
            !hasRole(currentUser, User.UserRole.SCRUM_MASTER)) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setContent(newContent);
        comment.setIsEdited(true);

        return taskCommentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        User currentUser = getCurrentUser();

        if (!comment.getAuthor().getId().equals(currentUser.getId()) &&
            !hasRole(currentUser, User.UserRole.SCRUM_MASTER)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        taskCommentRepository.delete(comment);
    }

    public Optional<TaskComment> getCommentById(Long commentId) {
        return taskCommentRepository.findById(commentId);
    }

    public List<TaskComment> getCommentsByTaskIdAndType(Long taskId, TaskComment.CommentType type) {
        return taskCommentRepository.findByTaskIdAndTypeOrderByCreatedAtAsc(taskId, type);
    }

    public List<TaskComment> getCommentsByTaskIdAndAuthor(Long taskId, Long authorId) {
        return taskCommentRepository.findByTaskIdAndAuthorIdOrderByCreatedAtAsc(taskId, authorId);
    }

    public Long countCommentsByTaskId(Long taskId) {
        return taskCommentRepository.countByTaskId(taskId);
    }

    public List<TaskComment> searchComments(Long taskId, String searchTerm) {
        return taskCommentRepository.searchByTaskIdAndContent(taskId, searchTerm);
    }

    public TaskComment createStatusChangeComment(Long taskId, String oldStatus, String newStatus, User changedBy) {
        String content = String.format("Status changed from %s to %s",
                formatStatus(oldStatus), formatStatus(newStatus));

        TaskComment comment = TaskComment.builder()
                .content(content)
                .type(TaskComment.CommentType.STATUS_CHANGE)
                .task(taskRepository.findById(taskId)
                        .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId)))
                .author(changedBy)
                .build();

        return taskCommentRepository.save(comment);
    }

    public TaskComment createAssignmentChangeComment(Long taskId, String oldAssignee, String newAssignee, User changedBy) {
        String content;
        if (oldAssignee == null && newAssignee != null) {
            content = String.format("Task assigned to %s", newAssignee);
        } else if (oldAssignee != null && newAssignee == null) {
            content = String.format("Task unassigned from %s", oldAssignee);
        } else if (oldAssignee != null && newAssignee != null) {
            content = String.format("Task reassigned from %s to %s", oldAssignee, newAssignee);
        } else {
            return null;
        }

        TaskComment comment = TaskComment.builder()
                .content(content)
                .type(TaskComment.CommentType.STATUS_CHANGE)
                .task(taskRepository.findById(taskId)
                        .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId)))
                .author(changedBy)
                .build();

        return taskCommentRepository.save(comment);
    }


    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private boolean hasRole(User user, User.UserRole role) {
        return user.getRole() == role;
    }

    private String formatStatus(String status) {
        if (status == null) return "Unknown";
        return status.replace("_", " ").toLowerCase();
    }
}