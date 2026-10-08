package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.ConversionHistory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConversionHistoryDaoImplTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private ConversionHistoryDaoImpl historyDao;

    @BeforeEach
    void setUp() {
        historyDao = new ConversionHistoryDaoImpl(jdbcTemplate);
    }

    @Test
    void addHistoryInsertsConversionAndReturnsIt() {
        ConversionHistory history = new ConversionHistory();
        history.setUserId(1);
        history.setFromCurrencyId(3);
        history.setToCurrencyId(2);
        history.setAmount(new BigDecimal("150.00"));
        history.setExchangeRate(new BigDecimal("1.23451"));
        history.setConvertedAmount(new BigDecimal("185.18"));
        history.setDate(LocalDateTime.parse("2026-10-02T12:00:00"));
        history.setNotes("Unit test");

        ConversionHistory result = historyDao.addHistory(history);

        assertSame(history, result);
        verify(jdbcTemplate).update(
                "INSERT INTO conversion_history(user_id, from_currency_id, to_currency_id, amount, exchange_rate, converted_amount, conversion_date, notes) VALUES(?,?,?,?,?,?,?,?)",
                1, 3, 2, new BigDecimal("150.00"), new BigDecimal("1.23451"),
                new BigDecimal("185.18"), history.getDate(), "Unit test"
        );
    }

    @Test
    void getHistoryByUserIdQueriesForThatUser() {
        List<ConversionHistory> expected = List.of(new ConversionHistory());
        when(jdbcTemplate.query(any(String.class), any(RowMapper.class), eq(1))).thenReturn(expected);

        List<ConversionHistory> result = historyDao.getHistoryByUserId(1);

        assertSame(expected, result);
        verify(jdbcTemplate).query(any(String.class), any(RowMapper.class), eq(1));
    }

    @Test
    void deleteHistoryDeletesByHistoryId() {
        historyDao.deleteHistory(12);

        verify(jdbcTemplate).update("DELETE FROM conversion_history WHERE hid = ?", 12);
    }

    @Test
    void deleteAllHistoryDeletesByUserId() {
        historyDao.deleteAllHistory(7);

        verify(jdbcTemplate).update("DELETE FROM conversion_history WHERE user_id = ?", 7);
    }
}
