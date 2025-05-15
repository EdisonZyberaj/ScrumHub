package dev.scrumHub.service;

import dev.scrumHub.dto.AuthResponse;
import dev.scrumHub.dto.LoginRequest;
import dev.scrumHub.dto.RegisterRequest;
import dev.scrumHub.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Create user entity
        var user = User.builder()
                .username(generateUsername(request.getName(), request.getLastName()))
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getName() + " " + request.getLastName())
                .role(request.getRole())
                .active(true)
                .build();

        // Save user to database
        var savedUser = userService.save(user);

        // Generate JWT token
        var jwtToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(savedUser.getEmail())
                        .password(savedUser.getPassword())
                        .authorities("ROLE_" + savedUser.getRole().name())
                        .build()
        );

        // Return response
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Get user from database
        var user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JWT token
        var jwtToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("ROLE_" + user.getRole().name())
                        .build()
        );

        // Return response
        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToUserResponse(user))
                .build();
    }

    // Helper method to generate username from name and lastName
    private String generateUsername(String name, String lastName) {
        // Remove spaces and special characters, convert to lowercase
        String baseName = (name.substring(0, 1) + lastName)
                .replaceAll("\\s+", "")
                .replaceAll("[^a-zA-Z0-9]", "")
                .toLowerCase();

        // Check if username exists, add numbers if needed
        String username = baseName;
        int counter = 1;

        while (userService.findByEmail(username + "@scrumhub.internal").isPresent()) {
            username = baseName + counter++;
        }

        return username;
    }

    // Helper method to map User entity to UserResponse
    private dev.scrumHub.dto.UserResponse mapToUserResponse(User user) {
        return dev.scrumHub.dto.UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}