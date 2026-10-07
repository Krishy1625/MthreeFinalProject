package mthree.com.finalproject.service;

import mthree.com.finalproject.model.User;

public interface UserService {
    User addUser(User user);

    User findUserById(int userId);

    User findUserByUsername(String username);
}
