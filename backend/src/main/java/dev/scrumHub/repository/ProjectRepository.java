package dev.scrumHub.repository;

import dev.scrumHub.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByName(String name);
    Optional<Project> findByKey(String key);
    List<Project> findByActiveTrue();
    boolean existsByName(String name);
    boolean existsByKey(String key);
}