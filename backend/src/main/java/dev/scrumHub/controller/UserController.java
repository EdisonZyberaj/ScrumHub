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
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
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


    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserResponseDto updateRequest) {
        try {
            User currentUser = userService.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update user fields
            if (updateRequest.getFullName() != null) {
                currentUser.setFullName(updateRequest.getFullName());
            }
            if (updateRequest.getUsername() != null) {
                currentUser.setUsername(updateRequest.getUsername());
            }

            User updatedUser = userService.save(currentUser);
            UserResponseDto response = userMapper.toUserResponse(updatedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}