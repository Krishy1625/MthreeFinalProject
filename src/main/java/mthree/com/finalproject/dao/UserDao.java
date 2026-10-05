package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.User;

public interface UserDao {

    User addUser(User user);

    User findUserById(int userId);

    User findUserByUsername(String username);
}
