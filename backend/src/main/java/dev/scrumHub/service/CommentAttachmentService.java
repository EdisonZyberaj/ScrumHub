package dev.scrumHub.service;

import dev.scrumHub.model.CommentAttachment;
import dev.scrumHub.model.TaskComment;
import dev.scrumHub.model.User;
import dev.scrumHub.repository.CommentAttachmentRepository;
import dev.scrumHub.repository.TaskCommentRepository;
import dev.scrumHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentAttachmentService {

    private final CommentAttachmentRepository attachmentRepository;
    private final TaskCommentRepository commentRepository;
    private final UserRepository userRepository;

    @Value("${app.file.upload.dir:uploads/comments}")
    private String uploadDir;

    @Value("${app.file.max-size:10485760}")
    private long maxFileSize;

    public CommentAttachment uploadAttachment(Long commentId, MultipartFile file) throws IOException {
        validateFile(file);

        TaskComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        User currentUser = getCurrentUser();

        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        CommentAttachment.AttachmentType attachmentType = determineAttachmentType(file.getContentType(), originalFileName);

        CommentAttachment attachment = CommentAttachment.builder()
                .fileName(uniqueFileName)
                .originalFileName(originalFileName)
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .type(attachmentType)
                .comment(comment)
                .uploadedBy(currentUser)
                .build();

        return attachmentRepository.save(attachment);
    }

    public List<CommentAttachment> getAttachmentsByCommentId(Long commentId) {
        return attachmentRepository.findByCommentIdOrderByUploadedAtAsc(commentId);
    }

    public Optional<CommentAttachment> getAttachmentById(Long attachmentId) {
        return attachmentRepository.findById(attachmentId);
    }

    public byte[] getAttachmentContent(Long attachmentId) throws IOException {
        CommentAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + attachmentId));

        Path filePath = Paths.get(attachment.getFilePath());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on disk: " + attachment.getFilePath());
        }

        return Files.readAllBytes(filePath);
    }

    public void deleteAttachment(Long attachmentId) throws IOException {
        CommentAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + attachmentId));

        User currentUser = getCurrentUser();

        if (!attachment.getUploadedBy().getId().equals(currentUser.getId()) &&
            !hasRole(currentUser, User.UserRole.SCRUM_MASTER)) {
            throw new RuntimeException("You can only delete your own attachments");
        }

        Path filePath = Paths.get(attachment.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        attachmentRepository.delete(attachment);
    }

    public List<CommentAttachment> getAttachmentsByTaskId(Long taskId) {
        return attachmentRepository.findByTaskIdOrderByUploadedAtAsc(taskId);
    }

    public List<CommentAttachment> getAttachmentsByCommentIdAndType(Long commentId, CommentAttachment.AttachmentType type) {
        return attachmentRepository.findByCommentIdAndTypeOrderByUploadedAtAsc(commentId, type);
    }

    public List<CommentAttachment> searchAttachmentsByFileName(String searchTerm) {
        return attachmentRepository.searchByOriginalFileName(searchTerm);
    }

    public Long getTotalFileSizeByCommentId(Long commentId) {
        return attachmentRepository.getTotalFileSizeByCommentId(commentId);
    }

    @Transactional
    public void cleanupOrphanedAttachments() throws IOException {
        List<CommentAttachment> orphanedAttachments = attachmentRepository.findOrphanedAttachments();

        for (CommentAttachment attachment : orphanedAttachments) {
            Path filePath = Paths.get(attachment.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }

            attachmentRepository.delete(attachment);
        }
    }


    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds maximum allowed size of " + (maxFileSize / 1024 / 1024) + "MB");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new RuntimeException("File name is required");
        }

        String fileExtension = getFileExtension(originalFileName).toLowerCase();
        if (isDangerousFileExtension(fileExtension)) {
            throw new RuntimeException("File type not allowed: " + fileExtension);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    private boolean isDangerousFileExtension(String extension) {
        String[] dangerousExtensions = {".exe", ".bat", ".cmd", ".com", ".scr", ".pif", ".vbs", ".js", ".jar", ".app"};
        for (String dangerous : dangerousExtensions) {
            if (extension.equals(dangerous)) {
                return true;
            }
        }
        return false;
    }

    private CommentAttachment.AttachmentType determineAttachmentType(String contentType, String fileName) {
        if (contentType != null) {
            if (contentType.startsWith("image/")) {
                return CommentAttachment.AttachmentType.IMAGE;
            } else if (contentType.contains("pdf") || contentType.contains("document") || contentType.contains("text")) {
                return CommentAttachment.AttachmentType.DOCUMENT;
            }
        }

        String extension = getFileExtension(fileName).toLowerCase();
        switch (extension) {
            case ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg":
                return CommentAttachment.AttachmentType.IMAGE;
            case ".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt":
                return CommentAttachment.AttachmentType.DOCUMENT;
            case ".java", ".js", ".html", ".css", ".xml", ".json", ".py", ".cpp", ".c", ".h":
                return CommentAttachment.AttachmentType.CODE;
            case ".log", ".out":
                return CommentAttachment.AttachmentType.LOG;
            default:
                return CommentAttachment.AttachmentType.OTHER;
        }
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
}