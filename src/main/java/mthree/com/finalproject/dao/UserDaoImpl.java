package mthree.com.finalproject.dao;

import mthree.com.finalproject.dao.mappers.UserMapper;
import mthree.com.finalproject.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl implements UserDao {

    private final JdbcTemplate jdbcTemplate;

    public UserDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // add a new user to the db
    @Override
    public User addUser(User user) {
        final String ADD_USER = "INSERT INTO users(username, password_hash) VALUES(?,?)";
        jdbcTemplate.update(ADD_USER,
                user.getUsername(),
                user.getPasswordHash());
        return user;
    }

    // find user by userId
    @Override
    public User findUserById(int userId) {
        final String GET_USER_BY_ID = "SELECT * FROM users WHERE uid = ?";
        return jdbcTemplate.queryForObject(GET_USER_BY_ID, new UserMapper(), userId);
    }

    // find user by username
    @Override
    public User findUserByUsername(String username) {
        final String GET_USER_BY_USERNAME = "SELECT * FROM users WHERE username = ?";
        return jdbcTemplate.queryForObject(GET_USER_BY_USERNAME, new UserMapper(), username);
    }

}
