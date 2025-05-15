package dev.scrumHub.dto;

import dev.scrumHub.model.User.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String lastName;
    private String email;
    private String password;
    private UserRole role;
}