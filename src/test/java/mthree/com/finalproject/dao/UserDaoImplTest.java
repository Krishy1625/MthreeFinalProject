package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDaoImplTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private UserDaoImpl userDao;

    @BeforeEach
    void setUp() {
        userDao = new UserDaoImpl(jdbcTemplate);
    }

    @Test
    void addUserInsertsUserAndSetsGeneratedId() throws Exception {
        User user = new User();
        user.setUsername("alice");
        user.setPasswordHash("hashed-password");

        Connection connection = mock(Connection.class);
        PreparedStatement statement = mock(PreparedStatement.class);
        when(connection.prepareStatement(
                "INSERT INTO users(username, password_hash) VALUES(?,?)",
                Statement.RETURN_GENERATED_KEYS
        )).thenReturn(statement);
        doAnswer(invocation -> {
            PreparedStatementCreator creator = invocation.getArgument(0);
            KeyHolder keyHolder = invocation.getArgument(1);
            keyHolder.getKeyList().add(Map.of("uid", 42));
            creator.createPreparedStatement(connection);
            return 1;
        }).when(jdbcTemplate).update(any(PreparedStatementCreator.class), any(KeyHolder.class));

        User result = userDao.addUser(user);

        assertSame(user, result);
        assertEquals(42, user.getUserId());
        verify(statement).setString(1, "alice");
        verify(statement).setString(2, "hashed-password");
    }

    @Test
    void findUserByIdQueriesById() {
        User expected = new User();
        when(jdbcTemplate.queryForObject(any(String.class), any(RowMapper.class), eq(2)))
                .thenReturn(expected);

        User result = userDao.findUserById(2);

        assertSame(expected, result);
        verify(jdbcTemplate).queryForObject(
                eq("SELECT * FROM users WHERE uid = ?"), any(RowMapper.class), eq(2)
        );
    }

    @Test
    void findUserByUsernameQueriesByUsername() {
        User expected = new User();
        when(jdbcTemplate.queryForObject(any(String.class), any(RowMapper.class), eq("alice")))
                .thenReturn(expected);

        User result = userDao.findUserByUsername("alice");

        assertSame(expected, result);
        verify(jdbcTemplate).queryForObject(
                eq("SELECT * FROM users WHERE username = ?"), any(RowMapper.class), eq("alice")
        );
    }
}
