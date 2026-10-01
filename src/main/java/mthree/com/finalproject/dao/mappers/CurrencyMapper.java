package mthree.com.finalproject.dao.mappers;

import mthree.com.finalproject.model.Currency;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class CurrencyMapper implements RowMapper<Currency> {
    @Override
    public Currency mapRow(ResultSet rs, int rowNum) throws SQLException {
        Currency c = new Currency();

        c.setCurrencyId(rs.getInt("cid"));
        c.setCurrencyCode(rs.getString("currency_code"));
        c.setCurrencyName(rs.getString("currency_name"));
        c.setCurrencySymbol(rs.getString("currency_symbol"));

        return c;
    }
}
