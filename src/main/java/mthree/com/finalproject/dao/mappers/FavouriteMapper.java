package mthree.com.finalproject.dao.mappers;

import mthree.com.finalproject.model.Favourite;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class FavouriteMapper implements RowMapper<Favourite> {
    @Override
    public Favourite mapRow(ResultSet rs, int rowNum) throws SQLException {
        Favourite favourite = new Favourite();

        favourite.setFavId(rs.getInt("fid"));
        favourite.setUserId(rs.getInt("user_id"));
        favourite.setFromCurrencyId(rs.getInt("from_currency_id"));
        favourite.setToCurrencyId(rs.getInt("to_currency_id"));
        favourite.setFromCurrencyCode(rs.getString("from_currency_code"));
        favourite.setToCurrencyCode(rs.getString("to_currency_code"));
        favourite.setFromCurrencyName(rs.getString("from_currency_name"));
        favourite.setToCurrencyName(rs.getString("to_currency_name"));

        return favourite;
    }
}
