package dev.scrumHub.controller;

import dev.scrumHub.dto.UserResponseDto;
import dev.scrumHub.mapper.UserMapper;
import dev.scrumHub.model.User;
import dev.scrumHub.model.User.UserRole;
import dev.scrumHub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponseDto response = userMapper.toUserResponse(user);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long projectId) {
        
        List<User> users;
        
        if (projectId != null) {
            users = userService.findByProjectId(projectId);
        } else if (role != null) {
            // Handle multiple roles separated by comma (e.g., "DEVELOPER,TESTER")
            String[] roles = role.split(",");
            List<UserRole> userRoles = Arrays.stream(roles)
                    .map(r -> UserRole.valueOf(r.trim().toUpperCase()))
                    .collect(Collectors.toList());
            users = userService.findByRoles(userRoles);
        } else {
            users = userService.findAllActiveUsers();
        }
        
        List<UserResponseDto> userDtos = users.stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(userMapper::toUserResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}