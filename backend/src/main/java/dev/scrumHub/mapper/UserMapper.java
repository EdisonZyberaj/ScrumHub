package dev.scrumHub.mapper;

import dev.scrumHub.dto.UserResponseDto;
import dev.scrumHub.dto.RegisterRequestDto;
import dev.scrumHub.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponseDto toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }


    public User toUser(RegisterRequestDto registerRequest) {
        if (registerRequest == null) {
            return null;
        }

        return User.builder()
                .username(generateUsername(registerRequest.getFirstName(), registerRequest.getLastName()))
                .email(registerRequest.getEmail())
                .fullName(registerRequest.getFirstName() + " " + registerRequest.getLastName())
                .role(registerRequest.getRole())
                .active(true)
                .build();
    }


    private String generateUsername(String name, String lastName) {
        String baseName = (name.substring(0, 1) + lastName)
                .replaceAll("\\s+", "")
                .replaceAll("[^a-zA-Z0-9]", "")
                .toLowerCase();

        return baseName;
    }
}