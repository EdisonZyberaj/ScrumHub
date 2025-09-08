package dev.scrumHub.repository;

import dev.scrumHub.model.User;
import dev.scrumHub.model.User.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByRoleIn(List<UserRole> roles);
    
    @Query("SELECT u FROM User u JOIN u.projectMemberships pm WHERE pm.project.id = :projectId")
    List<User> findByProjectId(@Param("projectId") Long projectId);
    
    @Query("SELECT u FROM User u JOIN u.projectMemberships pm WHERE pm.project.id = :projectId AND pm.roleInProject = :roleInProject")
    List<User> findByProjectIdAndRoleInProject(@Param("projectId") Long projectId, @Param("roleInProject") String roleInProject);
}