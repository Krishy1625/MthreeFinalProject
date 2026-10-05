package mthree.com.finalproject.controller;

import mthree.com.finalproject.dao.UserDao;
import mthree.com.finalproject.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserControllerTest {

    private UserDao userDao;
    private PasswordEncoder passwordEncoder;
    private UserController userController;

    @BeforeEach
    void setUp() {
        userDao = mock(UserDao.class);
        passwordEncoder = new BCryptPasswordEncoder();
        userController = new UserController(userDao, passwordEncoder);
    }

    @Test
    void registerStoresEncodedPasswordAndReturnsPublicUserDetails() {
        when(userDao.findUserByUsername("alice")).thenThrow(new EmptyResultDataAccessException(1));
        doAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(42);
            return user;
        }).when(userDao).addUser(any(User.class));

        UserController.RegisterRequest request = new UserController.RegisterRequest();
        request.setUsername("alice");
        request.setPassword("password123");
        request.setConfirmPassword("password123");
        var response = userController.register(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        UserController.UserResponse body = assertInstanceOf(UserController.UserResponse.class, response.getBody());
        assertEquals(42, body.getUserId());
        assertEquals("alice", body.getUsername());

        var storedUser = org.mockito.ArgumentCaptor.forClass(User.class);
        verify(userDao).addUser(storedUser.capture());
        assertTrue(passwordEncoder.matches("password123", storedUser.getValue().getPasswordHash()));
        assertFalse(storedUser.getValue().getPasswordHash().equals("password123"));
    }

    @Test
    void registerRejectsMismatchedPasswords() {
        UserController.RegisterRequest request = new UserController.RegisterRequest();
        request.setUsername("alice");
        request.setPassword("password123");
        request.setConfirmPassword("different123");

        var response = userController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        UserController.ApiError body = assertInstanceOf(UserController.ApiError.class, response.getBody());
        assertEquals("Passwords do not match.", body.getMessage());
    }

    @Test
    void loginAcceptsTheRegisteredPassword() {
        User user = new User();
        user.setUserId(42);
        user.setUsername("alice");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        when(userDao.findUserByUsername("alice")).thenReturn(user);

        UserController.LoginRequest request = new UserController.LoginRequest();
        request.setUsername("alice");
        request.setPassword("password123");
        var response = userController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(UserController.UserResponse.class, response.getBody());
    }

    @Test
    void loginRejectsAnIncorrectPassword() {
        User user = new User();
        user.setUsername("alice");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        when(userDao.findUserByUsername("alice")).thenReturn(user);

        UserController.LoginRequest request = new UserController.LoginRequest();
        request.setUsername("alice");
        request.setPassword("wrongpassword");
        var response = userController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
