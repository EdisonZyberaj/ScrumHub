package dev.scrumHub.repository;

import dev.scrumHub.model.Sprint;
import dev.scrumHub.model.Sprint.SprintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectId(Long projectId);
    List<Sprint> findByProjectIdAndStatus(Long projectId, SprintStatus status);
    List<Sprint> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    boolean existsByProjectIdAndName(Long projectId, String name);
}