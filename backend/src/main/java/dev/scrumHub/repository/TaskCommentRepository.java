package dev.scrumHub.repository;

import dev.scrumHub.model.TaskComment;
import dev.scrumHub.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskCommentRepository extends JpaRepository<TaskComment, Long> {

    List<TaskComment> findByTaskOrderByCreatedAtAsc(Task task);

    @Query("SELECT tc FROM TaskComment tc WHERE tc.task.id = :taskId ORDER BY tc.createdAt ASC")
    List<TaskComment> findByTaskIdOrderByCreatedAtAsc(@Param("taskId") Long taskId);

    @Query("SELECT tc FROM TaskComment tc WHERE tc.task.id = :taskId AND tc.parentComment IS NULL ORDER BY tc.createdAt ASC")
    List<TaskComment> findTopLevelCommentsByTaskId(@Param("taskId") Long taskId);

    List<TaskComment> findByParentCommentOrderByCreatedAtAsc(TaskComment parentComment);

    @Query("SELECT tc FROM TaskComment tc WHERE tc.parentComment.id = :parentCommentId ORDER BY tc.createdAt ASC")
    List<TaskComment> findByParentCommentIdOrderByCreatedAtAsc(@Param("parentCommentId") Long parentCommentId);

    @Query("SELECT tc FROM TaskComment tc WHERE tc.task.id = :taskId AND tc.type = :type ORDER BY tc.createdAt ASC")
    List<TaskComment> findByTaskIdAndTypeOrderByCreatedAtAsc(@Param("taskId") Long taskId, @Param("type") TaskComment.CommentType type);

    @Query("SELECT tc FROM TaskComment tc WHERE tc.task.id = :taskId AND tc.author.id = :authorId ORDER BY tc.createdAt ASC")
    List<TaskComment> findByTaskIdAndAuthorIdOrderByCreatedAtAsc(@Param("taskId") Long taskId, @Param("authorId") Long authorId);

    @Query("SELECT COUNT(tc) FROM TaskComment tc WHERE tc.task.id = :taskId")
    Long countByTaskId(@Param("taskId") Long taskId);

    @Query("SELECT COUNT(tc) FROM TaskComment tc WHERE tc.task.id = :taskId AND tc.parentComment IS NULL")
    Long countTopLevelCommentsByTaskId(@Param("taskId") Long taskId);

    @Query("SELECT tc FROM TaskComment tc ORDER BY tc.createdAt DESC")
    List<TaskComment> findRecentComments();

    @Query("SELECT DISTINCT tc FROM TaskComment tc LEFT JOIN FETCH tc.attachments WHERE tc.task.id = :taskId ORDER BY tc.createdAt ASC")
    List<TaskComment> findByTaskIdWithAttachments(@Param("taskId") Long taskId);

    @Query("SELECT tc FROM TaskComment tc WHERE tc.task.id = :taskId AND LOWER(tc.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY tc.createdAt ASC")
    List<TaskComment> searchByTaskIdAndContent(@Param("taskId") Long taskId, @Param("searchTerm") String searchTerm);

    void deleteByTask(Task task);

    @Query("DELETE FROM TaskComment tc WHERE tc.task.id = :taskId")
    void deleteByTaskId(@Param("taskId") Long taskId);
}