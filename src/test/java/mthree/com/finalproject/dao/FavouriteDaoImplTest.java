package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Favourite;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavouriteDaoImplTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private FavouriteDaoImpl favDao;

    @BeforeEach
    void setUp() {
        favDao = new FavouriteDaoImpl(jdbcTemplate);
    }

    @Test
    void getAllFavouritesQueriesForUser() {
        List<Favourite> expected = List.of(new Favourite());
        when(jdbcTemplate.query(any(String.class), any(RowMapper.class), eq(1))).thenReturn(expected);

        List<Favourite> result = favDao.getAllFavourites(1);

        assertSame(expected, result);
        verify(jdbcTemplate).query(any(String.class), any(RowMapper.class), eq(1));
    }

    @Test
    void addFavouriteInsertsAndReturnsFavourite() {
        Favourite favourite = new Favourite();
        favourite.setUserId(1);
        favourite.setFromCurrencyId(3);
        favourite.setToCurrencyId(2);

        Favourite result = favDao.addFavourite(favourite);

        assertSame(favourite, result);
        verify(jdbcTemplate).update(
                "INSERT INTO favourites(user_id, from_currency_id, to_currency_id) VALUES(?,?,?)",
                1, 3, 2
        );
    }

    @Test
    void editFavouriteUpdatesPairForUserAndReturnsFavourite() {
        Favourite favourite = new Favourite();
        favourite.setFavId(5);
        favourite.setUserId(1);
        favourite.setFromCurrencyId(2);
        favourite.setToCurrencyId(4);

        Favourite result = favDao.editFavourite(favourite);

        assertSame(favourite, result);
        verify(jdbcTemplate).update(
                "UPDATE favourites SET from_currency_id = ?, to_currency_id = ? WHERE fid = ? AND user_id = ?",
                2, 4, 5, 1
        );
    }

    @Test
    void deleteFavouriteDeletesById() {
        favDao.deleteFavourite(5);

        verify(jdbcTemplate).update("DELETE FROM favourites WHERE fid = ?", 5);
    }
}
