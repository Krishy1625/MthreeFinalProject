package mthree.com.finalproject.service;

import mthree.com.finalproject.model.User;

public interface UserService {
    User addUser(User user);

    User findUserById(int userId);

    User findUserByUsername(String username);

    User registerUser(String username, String password, String confirmPassword);

    User loginUser(String username, String password);
}
