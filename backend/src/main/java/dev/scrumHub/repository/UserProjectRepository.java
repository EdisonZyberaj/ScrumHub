package dev.scrumHub.repository;

import dev.scrumHub.model.UserProject;
import dev.scrumHub.model.UserProjectId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProjectRepository extends JpaRepository<UserProject, UserProjectId> {
    List<UserProject> findByProjectId(Long projectId);
    List<UserProject> findByUserId(Long userId);
    List<UserProject> findByProjectIdAndRoleInProject(Long projectId, UserProject.ProjectRole roleInProject);
    long countByProjectId(Long projectId);
}