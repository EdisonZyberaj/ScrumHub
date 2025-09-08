package dev.scrumHub.service;

import dev.scrumHub.dto.CreateSprintRequestDto;
import dev.scrumHub.dto.SprintResponseDto;
import dev.scrumHub.dto.UpdateSprintStatusRequestDto;
import dev.scrumHub.model.Project;
import dev.scrumHub.model.Sprint;
import dev.scrumHub.model.Sprint.SprintStatus;
import dev.scrumHub.model.Task.TaskStatus;
import dev.scrumHub.repository.ProjectRepository;
import dev.scrumHub.repository.SprintRepository;
import dev.scrumHub.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SprintService {
    
    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public List<SprintResponseDto> getSprintsByProjectId(Long projectId) {
        List<Sprint> sprints = sprintRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        return sprints.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SprintResponseDto getSprintById(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + id));
        return convertToDto(sprint);
    }

    @Transactional
    public SprintResponseDto createSprint(CreateSprintRequestDto requestDto) {
        // Check if project exists
        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + requestDto.getProjectId()));

        // Check if sprint name is unique within project
        if (sprintRepository.existsByProjectIdAndName(requestDto.getProjectId(), requestDto.getName())) {
            throw new RuntimeException("Sprint with name '" + requestDto.getName() + "' already exists in this project");
        }

        Sprint sprint = Sprint.builder()
                .name(requestDto.getName())
                .goal(requestDto.getGoal())
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .project(project)
                .status(SprintStatus.PLANNED)
                .build();

        Sprint savedSprint = sprintRepository.save(sprint);
        return convertToDto(savedSprint);
    }

    @Transactional
    public SprintResponseDto updateSprintStatus(Long sprintId, UpdateSprintStatusRequestDto requestDto) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + sprintId));

        if (requestDto.isActive()) {
            // Deactivate other active sprints in the same project
            List<Sprint> activeSprints = sprintRepository.findByProjectIdAndStatus(
                    sprint.getProject().getId(), SprintStatus.ACTIVE);
            
            for (Sprint activeSprint : activeSprints) {
                if (!activeSprint.getId().equals(sprintId)) {
                    activeSprint.setStatus(SprintStatus.PLANNED);
                    sprintRepository.save(activeSprint);
                }
            }
            
            sprint.setStatus(SprintStatus.ACTIVE);
        } else {
            sprint.setStatus(SprintStatus.PLANNED);
        }

        Sprint savedSprint = sprintRepository.save(sprint);
        return convertToDto(savedSprint);
    }

    @Transactional
    public void deleteSprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found with id: " + sprintId));
        
        // Check if sprint has tasks
        long taskCount = taskRepository.countBySprintId(sprintId);
        if (taskCount > 0) {
            throw new RuntimeException("Cannot delete sprint with existing tasks. Please move or delete tasks first.");
        }
        
        sprintRepository.delete(sprint);
    }

    private SprintResponseDto convertToDto(Sprint sprint) {
        long totalTasks = taskRepository.countBySprintId(sprint.getId());
        long completedTasks = taskRepository.countBySprintIdAndStatus(sprint.getId(), TaskStatus.DONE);
        int progress = totalTasks > 0 ? (int) ((completedTasks * 100) / totalTasks) : 0;
        
        return SprintResponseDto.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .goal(sprint.getGoal())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .status(sprint.getStatus().toString())
                .projectId(sprint.getProject().getId())
                .projectName(sprint.getProject().getName())
                .totalTasks((int) totalTasks)
                .completedTasks((int) completedTasks)
                .progress(progress)
                .active(sprint.getStatus() == SprintStatus.ACTIVE)
                .createdAt(sprint.getCreatedAt())
                .updatedAt(sprint.getUpdatedAt())
                .build();
    }
}