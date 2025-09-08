package dev.scrumHub.service;

import dev.scrumHub.model.User;
import dev.scrumHub.model.User.UserRole;
import dev.scrumHub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        dev.scrumHub.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    public Optional<dev.scrumHub.model.User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public dev.scrumHub.model.User save(dev.scrumHub.model.User user) {
        return userRepository.save(user);
    }

    public Optional<dev.scrumHub.model.User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<dev.scrumHub.model.User> findAllActiveUsers() {
        return userRepository.findAll().stream()
                .filter(User::isActive)
                .toList();
    }

    public List<dev.scrumHub.model.User> findByRoles(List<UserRole> roles) {
        return userRepository.findByRoleIn(roles);
    }

    public List<dev.scrumHub.model.User> findByProjectId(Long projectId) {
        return userRepository.findByProjectId(projectId);
    }
}