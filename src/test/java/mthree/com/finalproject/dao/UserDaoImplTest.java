package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserDaoImplTest {

    @Autowired
    private UserDao userDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM users WHERE username = ?", "testuser3");
    }

    @Test
    void addUser() {
        User newUser = new User();
        newUser.setUsername("testuser3");
        newUser.setPasswordHash("hashedpassword3");

        userDao.addUser(newUser);

        User savedUser = userDao.findUserByUsername("testuser3");

        assertNotNull(savedUser);
        assertEquals("testuser3", savedUser.getUsername());
        assertEquals("hashedpassword3", savedUser.getPasswordHash());
    }

    @Test
    void findUserById() {
        User user = userDao.findUserById(2);

        assertThrows(Exception.class, () -> {userDao.findUserById(99999);});

        assertNotNull(user);
        assertEquals("testuser2", user.getUsername());
        assertEquals("hashedpassword2", user.getPasswordHash());
    }

    @Test
    void findUserByUsername() {
        User user = userDao.findUserByUsername("testuser1");

        assertThrows(Exception.class, () -> {userDao.findUserByUsername("m");});

        assertNotNull(user);
        assertEquals("testuser1", user.getUsername());
        assertEquals("hashedpassword1", user.getPasswordHash());
    }
}