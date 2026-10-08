package mthree.com.finalproject.service;

import mthree.com.finalproject.dao.UserDao;
import mthree.com.finalproject.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import java.nio.charset.StandardCharsets;
import org.springframework.dao.EmptyResultDataAccessException;

@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User addUser(User user) {
        return userDao.addUser(user);
    }

    @Override
    public User findUserById(int userId) {
        return userDao.findUserById(userId);
    }

    @Override
    public User findUserByUsername(String username) {
        return userDao.findUserByUsername(username);
    }

    @Override
    public User registerUser(String username, String password, String confirmPassword) {
        username = username.trim();

        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("Password must be no more than 72 bytes.");
        }

        try {
            userDao.findUserByUsername(username);
            throw new DuplicateKeyException("That username is already in use.");
        } catch (EmptyResultDataAccessException exception) {
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));

        return userDao.addUser(user);
    }

    @Override
    public User loginUser(String username, String password) {
        User user;

        try {
            user = userDao.findUserByUsername(username.trim());
        } catch (EmptyResultDataAccessException exception) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        return user;
    }

}
