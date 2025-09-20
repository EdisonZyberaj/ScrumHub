package dev.scrumHub.repository;

import dev.scrumHub.model.UserProject;
import dev.scrumHub.model.UserProjectId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProjectRepository extends JpaRepository<UserProject, UserProjectId> {

    List<UserProject> findByUserId(Long userId);

    List<UserProject> findByProjectId(Long projectId);

    @Query("SELECT COUNT(up) FROM UserProject up WHERE up.project.id = :projectId AND up.isActive = true")
    long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT up FROM UserProject up WHERE up.user.id = :userId AND up.isActive = true")
    List<UserProject> findActiveByUserId(@Param("userId") Long userId);

    @Query("SELECT up FROM UserProject up WHERE up.project.id = :projectId AND up.isActive = true")
    List<UserProject> findActiveByProjectId(@Param("projectId") Long projectId);
}