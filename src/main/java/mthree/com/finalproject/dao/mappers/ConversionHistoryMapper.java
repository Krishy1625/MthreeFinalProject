package mthree.com.finalproject.dao.mappers;

import mthree.com.finalproject.model.ConversionHistory;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ConversionHistoryMapper implements RowMapper<ConversionHistory> {
    @Override
    public ConversionHistory mapRow(ResultSet rs, int rowNum) throws SQLException {
        ConversionHistory ch = new ConversionHistory();

        ch.setHistoryId(rs.getInt("hid"));
        ch.setUserId(rs.getInt("user_id"));
        ch.setFromCurrencyId(rs.getInt("from_currency_id"));
        ch.setToCurrencyId(rs.getInt("to_currency_id"));
        ch.setAmount(rs.getBigDecimal("amount"));
        ch.setExchangeRate(rs.getBigDecimal("exchange_rate"));
        ch.setConvertedAmount(rs.getBigDecimal("converted_amount"));
        ch.setDate(rs.getTimestamp("conversion_date").toLocalDateTime());
        ch.setNotes(rs.getString("notes"));

        return ch;
    }
}
