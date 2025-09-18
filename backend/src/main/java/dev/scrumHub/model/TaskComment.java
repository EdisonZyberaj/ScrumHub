package dev.scrumHub.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "task_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"task", "author", "parentComment", "replies", "attachments"})
@ToString(exclude = {"task", "author", "parentComment", "replies", "attachments"})
public class TaskComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CommentType type = CommentType.GENERAL;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    @JsonBackReference
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    @JsonBackReference
    private TaskComment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<TaskComment> replies = new ArrayList<>();

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<CommentAttachment> attachments = new ArrayList<>();

    @Column(name = "is_edited", nullable = false)
    @Builder.Default
    private Boolean isEdited = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum CommentType {
        GENERAL,
        STATUS_CHANGE,
        BUG_REPORT,
        CODE_REVIEW,
        PROGRESS_UPDATE,
        TESTING_NOTES,
        SCRUM_NOTES
    }

    public void addReply(TaskComment reply) {
        replies.add(reply);
        reply.setParentComment(this);
    }

    public void removeReply(TaskComment reply) {
        replies.remove(reply);
        reply.setParentComment(null);
    }

    public void addAttachment(CommentAttachment attachment) {
        attachments.add(attachment);
        attachment.setComment(this);
    }

    public void removeAttachment(CommentAttachment attachment) {
        attachments.remove(attachment);
        attachment.setComment(null);
    }

    public boolean isReply() {
        return parentComment != null;
    }

    public boolean hasReplies() {
        return replies != null && !replies.isEmpty();
    }

    public boolean hasAttachments() {
        return attachments != null && !attachments.isEmpty();
    }
}