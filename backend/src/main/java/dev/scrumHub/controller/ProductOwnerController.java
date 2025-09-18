package dev.scrumHub.controller;

import dev.scrumHub.model.*;
import dev.scrumHub.service.ProductBacklogService;
import dev.scrumHub.service.EpicService;
import dev.scrumHub.service.ReleaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/product-owner")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PRODUCT_OWNER')")
public class ProductOwnerController {

    private final ProductBacklogService productBacklogService;
    private final EpicService epicService;
    private final ReleaseService releaseService;


    @GetMapping("/projects/{projectId}/backlog")
    public ResponseEntity<List<ProductBacklogItem>> getProductBacklog(@PathVariable Long projectId) {
        List<ProductBacklogItem> backlog = productBacklogService.getProductBacklog(projectId);
        return ResponseEntity.ok(backlog);
    }

    @GetMapping("/projects/{projectId}/backlog/status/{status}")
    public ResponseEntity<List<ProductBacklogItem>> getBacklogItemsByStatus(
            @PathVariable Long projectId,
            @PathVariable ProductBacklogItem.BacklogStatus status) {
        List<ProductBacklogItem> items = productBacklogService.getBacklogItemsByStatus(projectId, status);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/projects/{projectId}/backlog/ready")
    public ResponseEntity<List<ProductBacklogItem>> getReadyItemsForSprint(@PathVariable Long projectId) {
        List<ProductBacklogItem> items = productBacklogService.getReadyItemsForSprint(projectId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/projects/{projectId}/backlog/refinement")
    public ResponseEntity<List<ProductBacklogItem>> getItemsNeedingRefinement(@PathVariable Long projectId) {
        List<ProductBacklogItem> items = productBacklogService.getItemsNeedingRefinement(projectId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/projects/{projectId}/backlog")
    public ResponseEntity<ProductBacklogItem> createBacklogItem(
            @PathVariable Long projectId,
            @RequestBody CreateBacklogItemRequest request) {
        ProductBacklogItem item = productBacklogService.createBacklogItem(
                projectId, request.getTitle(), request.getDescription(),
                request.getType(), request.getEpicId());
        return ResponseEntity.ok(item);
    }

    @PutMapping("/backlog/{itemId}")
    public ResponseEntity<ProductBacklogItem> updateBacklogItem(
            @PathVariable Long itemId,
            @RequestBody UpdateBacklogItemRequest request) {
        ProductBacklogItem item = productBacklogService.updateBacklogItem(
                itemId, request.getTitle(), request.getDescription(),
                request.getAcceptanceCriteria(), request.getStoryPoints(),
                request.getPriority());
        return ResponseEntity.ok(item);
    }

    @PutMapping("/projects/{projectId}/backlog/reorder")
    public ResponseEntity<Void> reorderBacklogItems(
            @PathVariable Long projectId,
            @RequestBody ReorderBacklogRequest request) {
        productBacklogService.reorderBacklogItems(projectId, request.getItemIdsInOrder());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/backlog/{itemId}/move-to-sprint")
    public ResponseEntity<Task> moveItemToSprint(
            @PathVariable Long itemId,
            @RequestBody MoveToSprintRequest request) {
        Task task = productBacklogService.moveItemToSprint(itemId, request.getSprintId());
        return ResponseEntity.ok(task);
    }

    @PutMapping("/backlog/{itemId}/mark-ready")
    public ResponseEntity<ProductBacklogItem> markAsReady(@PathVariable Long itemId) {
        ProductBacklogItem item = productBacklogService.markAsReady(itemId);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/backlog/{itemId}/assign-epic")
    public ResponseEntity<ProductBacklogItem> assignToEpic(
            @PathVariable Long itemId,
            @RequestBody AssignToEpicRequest request) {
        ProductBacklogItem item = productBacklogService.assignToEpic(itemId, request.getEpicId());
        return ResponseEntity.ok(item);
    }

    @GetMapping("/projects/{projectId}/backlog/search")
    public ResponseEntity<List<ProductBacklogItem>> searchBacklogItems(
            @PathVariable Long projectId,
            @RequestParam String searchTerm) {
        List<ProductBacklogItem> items = productBacklogService.searchBacklogItems(projectId, searchTerm);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/projects/{projectId}/backlog/statistics")
    public ResponseEntity<ProductBacklogService.BacklogStatistics> getBacklogStatistics(@PathVariable Long projectId) {
        ProductBacklogService.BacklogStatistics stats = productBacklogService.getBacklogStatistics(projectId);
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/backlog/{itemId}")
    public ResponseEntity<Void> deleteBacklogItem(@PathVariable Long itemId) {
        productBacklogService.deleteBacklogItem(itemId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/projects/{projectId}/epics")
    public ResponseEntity<List<Epic>> getEpicsByProject(@PathVariable Long projectId) {
        List<Epic> epics = epicService.getEpicsByProject(projectId);
        return ResponseEntity.ok(epics);
    }

    @GetMapping("/projects/{projectId}/epics/active")
    public ResponseEntity<List<Epic>> getActiveEpics(@PathVariable Long projectId) {
        List<Epic> epics = epicService.getActiveEpics(projectId);
        return ResponseEntity.ok(epics);
    }

    @PostMapping("/projects/{projectId}/epics")
    public ResponseEntity<Epic> createEpic(
            @PathVariable Long projectId,
            @RequestBody CreateEpicRequest request) {
        Epic epic = epicService.createEpic(
                projectId, request.getTitle(), request.getDescription(),
                request.getBusinessValue(), request.getPriority(),
                request.getEstimatedStoryPoints(), request.getTargetRelease());
        return ResponseEntity.ok(epic);
    }

    @PutMapping("/epics/{epicId}")
    public ResponseEntity<Epic> updateEpic(
            @PathVariable Long epicId,
            @RequestBody UpdateEpicRequest request) {
        Epic epic = epicService.updateEpic(
                epicId, request.getTitle(), request.getDescription(),
                request.getBusinessValue(), request.getStatus(),
                request.getPriority(), request.getEstimatedStoryPoints(),
                request.getTargetRelease(), request.getTargetCompletionDate());
        return ResponseEntity.ok(epic);
    }

    @PutMapping("/epics/{epicId}/start")
    public ResponseEntity<Epic> startEpic(@PathVariable Long epicId) {
        Epic epic = epicService.startEpic(epicId);
        return ResponseEntity.ok(epic);
    }

    @PutMapping("/epics/{epicId}/complete")
    public ResponseEntity<Epic> completeEpic(@PathVariable Long epicId) {
        Epic epic = epicService.completeEpic(epicId);
        return ResponseEntity.ok(epic);
    }

    @GetMapping("/projects/{projectId}/epics/status/{status}")
    public ResponseEntity<List<Epic>> getEpicsByStatus(
            @PathVariable Long projectId,
            @PathVariable Epic.EpicStatus status) {
        List<Epic> epics = epicService.getEpicsByStatus(projectId, status);
        return ResponseEntity.ok(epics);
    }

    @GetMapping("/epics/{epicId}/with-items")
    public ResponseEntity<Epic> getEpicWithBacklogItems(@PathVariable Long epicId) {
        return epicService.getEpicWithBacklogItems(epicId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/epics/{epicId}/items")
    public ResponseEntity<List<ProductBacklogItem>> getEpicBacklogItems(@PathVariable Long epicId) {
        List<ProductBacklogItem> items = productBacklogService.getEpicBacklogItems(epicId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/projects/{projectId}/epics/search")
    public ResponseEntity<List<Epic>> searchEpics(
            @PathVariable Long projectId,
            @RequestParam String searchTerm) {
        List<Epic> epics = epicService.searchEpics(projectId, searchTerm);
        return ResponseEntity.ok(epics);
    }

    @GetMapping("/projects/{projectId}/epics/statistics")
    public ResponseEntity<EpicService.EpicStatistics> getEpicStatistics(@PathVariable Long projectId) {
        EpicService.EpicStatistics stats = epicService.getEpicStatistics(projectId);
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/epics/{epicId}")
    public ResponseEntity<Void> deleteEpic(@PathVariable Long epicId) {
        epicService.deleteEpic(epicId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/projects/{projectId}/releases")
    public ResponseEntity<List<Release>> getReleasesByProject(@PathVariable Long projectId) {
        List<Release> releases = releaseService.getReleasesByProject(projectId);
        return ResponseEntity.ok(releases);
    }

    @GetMapping("/projects/{projectId}/releases/active")
    public ResponseEntity<List<Release>> getActiveReleases(@PathVariable Long projectId) {
        List<Release> releases = releaseService.getActiveReleases(projectId);
        return ResponseEntity.ok(releases);
    }

    @GetMapping("/projects/{projectId}/releases/current")
    public ResponseEntity<Release> getCurrentRelease(@PathVariable Long projectId) {
        return releaseService.getCurrentRelease(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/projects/{projectId}/releases")
    public ResponseEntity<Release> createRelease(
            @PathVariable Long projectId,
            @RequestBody CreateReleaseRequest request) {
        Release release = releaseService.createRelease(
                projectId, request.getName(), request.getDescription(),
                request.getVersionNumber(), request.getPriority(),
                request.getPlannedStartDate(), request.getPlannedReleaseDate(),
                request.getTargetStoryPoints(), request.getGoals());
        return ResponseEntity.ok(release);
    }

    @PutMapping("/releases/{releaseId}")
    public ResponseEntity<Release> updateRelease(
            @PathVariable Long releaseId,
            @RequestBody UpdateReleaseRequest request) {
        Release release = releaseService.updateRelease(
                releaseId, request.getName(), request.getDescription(),
                request.getVersionNumber(), request.getStatus(),
                request.getPriority(), request.getPlannedStartDate(),
                request.getPlannedReleaseDate(), request.getTargetStoryPoints(),
                request.getGoals(), request.getReleaseNotes());
        return ResponseEntity.ok(release);
    }

    @PutMapping("/releases/{releaseId}/start")
    public ResponseEntity<Release> startRelease(@PathVariable Long releaseId) {
        Release release = releaseService.startRelease(releaseId);
        return ResponseEntity.ok(release);
    }

    @PutMapping("/releases/{releaseId}/testing")
    public ResponseEntity<Release> moveToTesting(@PathVariable Long releaseId) {
        Release release = releaseService.moveToTesting(releaseId);
        return ResponseEntity.ok(release);
    }

    @PutMapping("/releases/{releaseId}/deploy")
    public ResponseEntity<Release> deployRelease(@PathVariable Long releaseId) {
        Release release = releaseService.deployRelease(releaseId);
        return ResponseEntity.ok(release);
    }

    @GetMapping("/projects/{projectId}/releases/statistics")
    public ResponseEntity<ReleaseService.ReleaseStatistics> getReleaseStatistics(@PathVariable Long projectId) {
        ReleaseService.ReleaseStatistics stats = releaseService.getReleaseStatistics(projectId);
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/releases/{releaseId}")
    public ResponseEntity<Void> deleteRelease(@PathVariable Long releaseId) {
        releaseService.deleteRelease(releaseId);
        return ResponseEntity.ok().build();
    }


    @lombok.Data
    public static class CreateBacklogItemRequest {
        private String title;
        private String description;
        private ProductBacklogItem.BacklogItemType type;
        private Long epicId;
    }

    @lombok.Data
    public static class UpdateBacklogItemRequest {
        private String title;
        private String description;
        private String acceptanceCriteria;
        private Integer storyPoints;
        private ProductBacklogItem.BacklogPriority priority;
    }

    @lombok.Data
    public static class ReorderBacklogRequest {
        private List<Long> itemIdsInOrder;
    }

    @lombok.Data
    public static class MoveToSprintRequest {
        private Long sprintId;
    }

    @lombok.Data
    public static class AssignToEpicRequest {
        private Long epicId;
    }

    @lombok.Data
    public static class CreateEpicRequest {
        private String title;
        private String description;
        private String businessValue;
        private Epic.EpicPriority priority;
        private Integer estimatedStoryPoints;
        private String targetRelease;
    }

    @lombok.Data
    public static class UpdateEpicRequest {
        private String title;
        private String description;
        private String businessValue;
        private Epic.EpicStatus status;
        private Epic.EpicPriority priority;
        private Integer estimatedStoryPoints;
        private String targetRelease;
        private LocalDateTime targetCompletionDate;
    }

    @lombok.Data
    public static class CreateReleaseRequest {
        private String name;
        private String description;
        private String versionNumber;
        private Release.ReleasePriority priority;
        private LocalDateTime plannedStartDate;
        private LocalDateTime plannedReleaseDate;
        private Integer targetStoryPoints;
        private String goals;
    }

    @lombok.Data
    public static class UpdateReleaseRequest {
        private String name;
        private String description;
        private String versionNumber;
        private Release.ReleaseStatus status;
        private Release.ReleasePriority priority;
        private LocalDateTime plannedStartDate;
        private LocalDateTime plannedReleaseDate;
        private Integer targetStoryPoints;
        private String goals;
        private String releaseNotes;
    }
}