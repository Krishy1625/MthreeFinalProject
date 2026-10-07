package mthree.com.finalproject.dao;

import mthree.com.finalproject.dao.mappers.UserMapper;
import mthree.com.finalproject.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

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
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    ADD_USER, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, user.getUsername());
            statement.setString(2, user.getPasswordHash());
            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        if (generatedId == null) {
            throw new IllegalStateException("Unable to retrieve the new user ID.");
        }
        user.setUserId(generatedId.intValue());
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
