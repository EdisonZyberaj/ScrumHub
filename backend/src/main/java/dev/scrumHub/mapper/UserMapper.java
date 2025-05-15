package dev.scrumHub.mapper;

import dev.scrumHub.dto.UserResponse;
import dev.scrumHub.dto.RegisterRequest;
import dev.scrumHub.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * Maps User entity to UserResponse DTO
     */
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    /**
     * Maps RegisterRequest DTO to User entity
     */
    public User toUser(RegisterRequest registerRequest) {
        if (registerRequest == null) {
            return null;
        }

        return User.builder()
                .username(generateUsername(registerRequest.getName(), registerRequest.getLastName()))
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getName() + " " + registerRequest.getLastName())
                .role(registerRequest.getRole())
                .active(true)
                .build();
    }

    /**
     * Helper method to generate username from name and lastName
     */
    private String generateUsername(String name, String lastName) {
        // Remove spaces and special characters, convert to lowercase
        String baseName = (name.substring(0, 1) + lastName)
                .replaceAll("\\s+", "")
                .replaceAll("[^a-zA-Z0-9]", "")
                .toLowerCase();

        return baseName;
    }
}