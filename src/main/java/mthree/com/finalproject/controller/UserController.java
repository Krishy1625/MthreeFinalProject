package mthree.com.finalproject.controller;

import mthree.com.finalproject.model.User;
import mthree.com.finalproject.service.UserService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String username = request.getUsername().trim();
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(new ApiError("Passwords do not match."));
        }
        if (request.getPassword().getBytes(StandardCharsets.UTF_8).length > 72) {
            return ResponseEntity.badRequest().body(new ApiError("Password must be no more than 72 bytes."));
        }

        if (userExistsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("That username is already in use."));
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        try {
            user = userService.addUser(user);
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("That username is already in use."));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        User user;
        try {
            user = userService.findUserByUsername(request.getUsername().trim());
        } catch (EmptyResultDataAccessException exception) {
            return invalidCredentials();
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return invalidCredentials();
        }
        return ResponseEntity.ok(toResponse(user));
    }

    private boolean userExistsByUsername(String username) {
        try {
            userService.findUserByUsername(username);
            return true;
        } catch (EmptyResultDataAccessException exception) {
            return false;
        }
    }

    private ResponseEntity<ApiError> invalidCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiError("Invalid username or password."));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getUserId(), user.getUsername());
    }

    public static class RegisterRequest {
        @NotBlank
        @Size(max = 30, message = "Username must be 30 characters or fewer.")
        private String username;

        @NotBlank
        @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters.")
        private String password;

        @NotBlank
        private String confirmPassword;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getConfirmPassword() {
            return confirmPassword;
        }

        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
        }
    }

    public static class LoginRequest {
        @NotBlank
        private String username;

        @NotBlank
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class UserResponse {
        private final int userId;
        private final String username;

        public UserResponse(int userId, String username) {
            this.userId = userId;
            this.username = username;
        }

        public int getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }
    }

    public static class ApiError {
        private final String message;

        public ApiError(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
