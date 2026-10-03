package mthree.com.finalproject.dao;

import mthree.com.finalproject.dao.mappers.ConversionHistoryMapper;
import mthree.com.finalproject.model.ConversionHistory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ConversionHistoryDaoImpl implements ConversionHistoryDao {

    private final JdbcTemplate jdbcTemplate;

    public ConversionHistoryDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Add a conversion to user's history
    @Override
    public ConversionHistory addHistory(ConversionHistory history) {
        final String ADD_HISTORY = "INSERT INTO conversion_history(" +
                "user_id, from_currency_id, to_currency_id, amount, exchange_rate, converted_amount, conversion_date, notes) " +
                "VALUES(?,?,?,?,?,?,?,?)";
        jdbcTemplate.update(ADD_HISTORY,
                history.getUserId(),
                history.getFromCurrencyId(),
                history.getToCurrencyId(),
                history.getAmount(),
                history.getExchangeRate(),
                history.getConvertedAmount(),
                history.getDate(),
                history.getNotes());
        return history;
    }

    // Get all conversion history for a user
    @Override
    public List<ConversionHistory> getHistoryByUserId(int userId) {
        final String GET_ALL_HISTORY = "SELECT * FROM conversion_history WHERE user_id = ? ORDER BY conversion_date DESC";
        return jdbcTemplate.query(
                GET_ALL_HISTORY,
                new ConversionHistoryMapper(),
                userId
        );
    }

    // Delete one history record
    @Override
    public void deleteHistory(int historyId) {
        final String DELETE_HISTORY = "DELETE FROM conversion_history WHERE hid = ?";
        jdbcTemplate.update(DELETE_HISTORY, historyId);
    }

    // Delete all history for a user
    @Override
    public void deleteAllHistory(int userId) {
        final String DELETE_ALL_HISTORY = "DELETE FROM conversion_history WHERE user_id = ?";
        jdbcTemplate.update(DELETE_ALL_HISTORY, userId);
    }
}
