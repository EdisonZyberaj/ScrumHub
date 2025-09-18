package dev.scrumHub.repository;

import dev.scrumHub.model.CommentAttachment;
import dev.scrumHub.model.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentAttachmentRepository extends JpaRepository<CommentAttachment, Long> {

    List<CommentAttachment> findByCommentOrderByUploadedAtAsc(TaskComment comment);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.comment.id = :commentId ORDER BY ca.uploadedAt ASC")
    List<CommentAttachment> findByCommentIdOrderByUploadedAtAsc(@Param("commentId") Long commentId);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.comment.id = :commentId AND ca.type = :type ORDER BY ca.uploadedAt ASC")
    List<CommentAttachment> findByCommentIdAndTypeOrderByUploadedAtAsc(@Param("commentId") Long commentId, @Param("type") CommentAttachment.AttachmentType type);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.comment.id = :commentId AND ca.uploadedBy.id = :uploaderId ORDER BY ca.uploadedAt ASC")
    List<CommentAttachment> findByCommentIdAndUploaderIdOrderByUploadedAtAsc(@Param("commentId") Long commentId, @Param("uploaderId") Long uploaderId);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.comment.id = :commentId AND ca.fileName = :fileName")
    Optional<CommentAttachment> findByCommentIdAndFileName(@Param("commentId") Long commentId, @Param("fileName") String fileName);

    Optional<CommentAttachment> findByFilePath(String filePath);

    @Query("SELECT COUNT(ca) FROM CommentAttachment ca WHERE ca.comment.id = :commentId")
    Long countByCommentId(@Param("commentId") Long commentId);

    @Query("SELECT COALESCE(SUM(ca.fileSize), 0) FROM CommentAttachment ca WHERE ca.comment.id = :commentId")
    Long getTotalFileSizeByCommentId(@Param("commentId") Long commentId);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.comment.task.id = :taskId ORDER BY ca.uploadedAt ASC")
    List<CommentAttachment> findByTaskIdOrderByUploadedAtAsc(@Param("taskId") Long taskId);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.contentType LIKE :contentTypePattern ORDER BY ca.uploadedAt DESC")
    List<CommentAttachment> findByContentTypePattern(@Param("contentTypePattern") String contentTypePattern);

    @Query("SELECT ca FROM CommentAttachment ca ORDER BY ca.uploadedAt DESC")
    List<CommentAttachment> findRecentAttachments();

    @Query("SELECT ca FROM CommentAttachment ca WHERE LOWER(ca.originalFileName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY ca.uploadedAt DESC")
    List<CommentAttachment> searchByOriginalFileName(@Param("searchTerm") String searchTerm);

    void deleteByComment(TaskComment comment);

    @Query("DELETE FROM CommentAttachment ca WHERE ca.comment.id = :commentId")
    void deleteByCommentId(@Param("commentId") Long commentId);

    @Query("SELECT ca FROM CommentAttachment ca WHERE ca.comment IS NULL")
    List<CommentAttachment> findOrphanedAttachments();
}