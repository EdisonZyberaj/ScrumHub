package dev.scrumHub.service;

import dev.scrumHub.dto.AuthResponseDto;
import dev.scrumHub.dto.LoginRequestDto;
import dev.scrumHub.dto.RegisterRequestDto;
import dev.scrumHub.mapper.UserMapper;
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
    private final UserMapper userMapper;

    public AuthResponseDto register(RegisterRequestDto request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = userMapper.toUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var savedUser = userService.save(user);

        var jwtToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(savedUser.getEmail())
                        .password(savedUser.getPassword())
                        .authorities("ROLE_" + savedUser.getRole().name())
                        .build()
        );

        return AuthResponseDto.builder()
                .token(jwtToken)
                .user(userMapper.toUserResponse(savedUser))
                .build();
    }

    public AuthResponseDto login(LoginRequestDto request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            var user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            var jwtToken = jwtService.generateToken(
                    org.springframework.security.core.userdetails.User
                            .withUsername(user.getEmail())
                            .password("")
                            .authorities("ROLE_" + user.getRole().name())
                            .build()
            );

            return AuthResponseDto.builder()
                    .token(jwtToken)
                    .user(userMapper.toUserResponse(user))
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
}