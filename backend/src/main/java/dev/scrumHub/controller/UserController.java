package dev.scrumHub.controller;

import dev.scrumHub.dto.PasswordChangeDto;
import dev.scrumHub.dto.UserProfileUpdateDto;
import dev.scrumHub.dto.UserResponseDto;
import dev.scrumHub.dto.UserStatsDto;
import dev.scrumHub.mapper.UserMapper;
import dev.scrumHub.model.User;
import dev.scrumHub.model.User.UserRole;
import dev.scrumHub.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponseDto response = userMapper.toUserResponse(user);

        return ResponseEntity.ok(response);
    }


    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileUpdateDto updateRequest) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (updateRequest.getFullName() != null && !updateRequest.getFullName().trim().isEmpty()) {
                currentUser.setFullName(updateRequest.getFullName().trim());
            }
            if (updateRequest.getUsername() != null && !updateRequest.getUsername().trim().isEmpty()) {
                if (userService.existsByUsernameAndNotId(updateRequest.getUsername(), currentUser.getId())) {
                    return ResponseEntity.badRequest().build();
                }
                currentUser.setUsername(updateRequest.getUsername().trim());
            }

            User updatedUser = userService.save(currentUser);
            UserResponseDto response = userMapper.toUserResponse(updatedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PasswordChangeDto passwordChangeRequest) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!passwordEncoder.matches(passwordChangeRequest.getCurrentPassword(), currentUser.getPassword())) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }

            if (!passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getConfirmNewPassword())) {
                return ResponseEntity.badRequest().body("New passwords do not match");
            }

            currentUser.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
            userService.save(currentUser);

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to change password");
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<UserStatsDto> getUserStatistics(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserStatsDto stats = userService.getUserStatistics(currentUser.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<?> getUserActivity(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var recentActivity = userService.getRecentUserActivity(currentUser.getId());
            return ResponseEntity.ok(recentActivity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}