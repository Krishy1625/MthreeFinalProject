package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Favourite;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FavouriteDaoImplTest {

    @Autowired
    private FavouriteDao favDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM favourites");

        jdbcTemplate.update(
                "INSERT INTO favourites (user_id, from_currency_id, to_currency_id) VALUES (?, ?, ?)",
                1, 1, 2
        );

        jdbcTemplate.update(
                "INSERT INTO favourites (user_id, from_currency_id, to_currency_id) VALUES (?, ?, ?)",
                1, 1, 3
        );

        jdbcTemplate.update(
                "INSERT INTO favourites (user_id, from_currency_id, to_currency_id) VALUES (?, ?, ?)",
                1, 2, 3
        );
    }

    @Test
    void getAllFavourites() {
        List<Favourite> favourites = favDao.getAllFavourites(1);

        assertEquals(3, favourites.size());
    }

    @Test
    void addFavourite() {
        Favourite fav = new Favourite();
        fav.setUserId(1);
        fav.setFromCurrencyId(3);
        fav.setToCurrencyId(2);

        Favourite added = favDao.addFavourite(fav);

        assertEquals(4, favDao.getAllFavourites(1).size());
        assertNotNull(added);
        assertEquals(1, added.getUserId());
        assertEquals(3, added.getFromCurrencyId());
        assertEquals(2, added.getToCurrencyId());
    }

    @Test
    void updateFavourite() {
        List<Favourite> favourites = favDao.getAllFavourites(1);
        Favourite favourite = favourites.get(0);

        favourite.setFromCurrencyId(2);
        favourite.setToCurrencyId(4);

        favDao.editFavourite(favourite);

        favourites = favDao.getAllFavourites(1);

        Favourite updatedFavourite = favourites.stream()
                .filter(f -> f.getFavId() == favourite.getFavId())
                .findFirst()
                .orElse(null);

        assertNotNull(updatedFavourite);
        assertEquals(2, updatedFavourite.getFromCurrencyId());
        assertEquals(4, updatedFavourite.getToCurrencyId());
    }

    @Test
    void deleteFavourite() {
        List<Favourite> favourites = favDao.getAllFavourites(1);

        int favouriteId = favourites.get(0).getFavId();
        favDao.deleteFavourite(favouriteId, 1);

        assertEquals(2, favDao.getAllFavourites(1).size());
    }

    @Test
    void deleteFavouriteDoesNotRemoveAnotherUsersFavourite() {
        List<Favourite> favourites = favDao.getAllFavourites(1);

        int favouriteId = favourites.get(0).getFavId();
        assertEquals(0, favDao.deleteFavourite(favouriteId, 2));
        assertEquals(3, favDao.getAllFavourites(1).size());
    }

    @Test
    void getAllFavouritesIncludesCurrencyCodes() {
        Favourite favourite = favDao.getAllFavourites(1).get(0);

        assertEquals("GBP", favourite.getFromCurrencyCode());
        assertEquals("EUR", favourite.getToCurrencyCode());
    }
}