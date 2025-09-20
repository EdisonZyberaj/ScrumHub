package dev.scrumHub.controller;

import dev.scrumHub.model.CommentAttachment;
import dev.scrumHub.model.TaskComment;
import dev.scrumHub.service.CommentAttachmentService;
import dev.scrumHub.service.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5177", "http://localhost:5178"})
public class TaskCommentController {

    private final TaskCommentService commentService;
    private final CommentAttachmentService attachmentService;

    @GetMapping
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<TaskComment>> getTaskComments(@PathVariable Long taskId) {
        try {
            List<TaskComment> comments = commentService.getCommentsByTaskId(taskId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/top-level")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<TaskComment>> getTopLevelComments(@PathVariable Long taskId) {
        try {
            List<TaskComment> comments = commentService.getTopLevelCommentsByTaskId(taskId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> createComment(
            @PathVariable Long taskId,
            @RequestBody Map<String, Object> commentRequest) {
        try {
            String content = (String) commentRequest.get("content");
            String typeStr = (String) commentRequest.getOrDefault("type", "GENERAL");

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Comment content is required"));
            }

            TaskComment.CommentType type;
            try {
                type = TaskComment.CommentType.valueOf(typeStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                type = TaskComment.CommentType.GENERAL;
            }

            TaskComment comment = commentService.createComment(taskId, content.trim(), type);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create comment"));
        }
    }

    @PostMapping("/{commentId}/replies")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> createReply(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> replyRequest) {
        try {
            String content = replyRequest.get("content");

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Reply content is required"));
            }

            TaskComment reply = commentService.createReply(commentId, content.trim());
            return ResponseEntity.status(HttpStatus.CREATED).body(reply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create reply"));
        }
    }

    @GetMapping("/{commentId}/replies")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<TaskComment>> getCommentReplies(
            @PathVariable Long taskId,
            @PathVariable Long commentId) {
        try {
            List<TaskComment> replies = commentService.getRepliesByCommentId(commentId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> updateComment(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> updateRequest) {
        try {
            String newContent = updateRequest.get("content");

            if (newContent == null || newContent.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Comment content is required"));
            }

            TaskComment updatedComment = commentService.updateComment(commentId, newContent.trim());
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update comment"));
        }
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long taskId,
            @PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete comment"));
        }
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<TaskComment>> getCommentsByType(
            @PathVariable Long taskId,
            @PathVariable String type) {
        try {
            TaskComment.CommentType commentType = TaskComment.CommentType.valueOf(type.toUpperCase());
            List<TaskComment> comments = commentService.getCommentsByTaskIdAndType(taskId, commentType);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<TaskComment>> searchComments(
            @PathVariable Long taskId,
            @RequestParam String query) {
        try {
            if (query.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            List<TaskComment> comments = commentService.searchComments(taskId, query.trim());
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable Long taskId) {
        try {
            Long count = commentService.countCommentsByTaskId(taskId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/{commentId}/attachments")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            @RequestParam("file") MultipartFile file) {
        try {
            CommentAttachment attachment = attachmentService.uploadAttachment(commentId, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload file"));
        }
    }

    @GetMapping("/{commentId}/attachments")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<CommentAttachment>> getCommentAttachments(
            @PathVariable Long taskId,
            @PathVariable Long commentId) {
        try {
            List<CommentAttachment> attachments = attachmentService.getAttachmentsByCommentId(commentId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/attachments/{attachmentId}/download")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> downloadAttachment(
            @PathVariable Long taskId,
            @PathVariable Long attachmentId) {
        try {
            Optional<CommentAttachment> attachmentOpt = attachmentService.getAttachmentById(attachmentId);
            if (attachmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            CommentAttachment attachment = attachmentOpt.get();
            byte[] content = attachmentService.getAttachmentContent(attachmentId);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachment.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + attachment.getOriginalFileName() + "\"")
                    .body(new ByteArrayResource(content));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to download file"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<?> deleteAttachment(
            @PathVariable Long taskId,
            @PathVariable Long attachmentId) {
        try {
            attachmentService.deleteAttachment(attachmentId);
            return ResponseEntity.ok(Map.of("message", "Attachment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete attachment"));
        }
    }

    @GetMapping("/attachments")
    @PreAuthorize("hasRole('DEVELOPER') or hasRole('TESTER') or hasRole('SCRUM_MASTER')")
    public ResponseEntity<List<CommentAttachment>> getTaskAttachments(@PathVariable Long taskId) {
        try {
            List<CommentAttachment> attachments = attachmentService.getAttachmentsByTaskId(taskId);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}