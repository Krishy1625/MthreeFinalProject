package mthree.com.finalproject.dao;

import mthree.com.finalproject.dao.mappers.FavouriteMapper;
import mthree.com.finalproject.model.Favourite;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FavouriteDaoImpl implements FavouriteDao {

    private final JdbcTemplate jdbcTemplate;

    public FavouriteDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // get list of all favourites for user
    @Override
    public List<Favourite> getAllFavourites(int userId) {
        final String GET_ALL_FAVOURITES = "SELECT * FROM favourites WHERE user_id = ?";
        return jdbcTemplate.query(
                GET_ALL_FAVOURITES,
                new FavouriteMapper(),
                userId
        );
    }

    // creates a new favourite for user
    @Override
    public Favourite addFavourite(Favourite favourite) {
        final String ADD_FAVOURITE = "INSERT INTO favourites(user_id, from_currency_id, to_currency_id) VALUES(?,?,?)";
        jdbcTemplate.update(ADD_FAVOURITE,
                favourite.getUserId(),
                favourite.getFromCurrencyId(),
                favourite.getToCurrencyId());
        return favourite;
    }

    // delete favourite
    @Override
    public void deleteFavourite(int favouriteId) {
        final String DELETE_FAVOURITE = "DELETE FROM favourites WHERE fid = ?";
        jdbcTemplate.update(DELETE_FAVOURITE, favouriteId);
    }
}
