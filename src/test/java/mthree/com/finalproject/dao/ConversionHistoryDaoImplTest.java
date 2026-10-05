package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.ConversionHistory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ConversionHistoryDaoImplTest {

    @Autowired
    private ConversionHistoryDao historyDao;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update("DELETE FROM conversion_history");

        jdbcTemplate.update(
                "INSERT INTO conversion_history " +
                        "(user_id, from_currency_id, to_currency_id, amount, exchange_rate, " +
                        "converted_amount, conversion_date, notes) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                1, 1, 2,
                new BigDecimal("100.00"),
                new BigDecimal("1.15000"),
                new BigDecimal("115.00"),
                LocalDateTime.parse("2026-10-01T10:00:00"),
                "Holiday"
        );

        jdbcTemplate.update(
                "INSERT INTO conversion_history " +
                        "(user_id, from_currency_id, to_currency_id, amount, exchange_rate, " +
                        "converted_amount, conversion_date, notes) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                1, 1, 3,
                new BigDecimal("50.00"),
                new BigDecimal("1.34000"),
                new BigDecimal("67.00"),
                LocalDateTime.parse("2026-10-02T12:00:00"),
                null
        );

        jdbcTemplate.update(
                "INSERT INTO conversion_history " +
                        "(user_id, from_currency_id, to_currency_id, amount, exchange_rate, " +
                        "converted_amount, conversion_date, notes) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                2, 3, 4,
                new BigDecimal("100.00"),
                new BigDecimal("150.00000"),
                new BigDecimal("15000.00"),
                LocalDateTime.parse("2026-10-02T14:00:00"),
                "Test conversion"
        );
    }

    @Test
    void addHistory() {
        ConversionHistory history = new ConversionHistory();
        history.setUserId(1);
        history.setFromCurrencyId(3);
        history.setToCurrencyId(2);
        history.setAmount(new BigDecimal("150.00"));
        history.setExchangeRate(new BigDecimal("1.23451"));
        history.setConvertedAmount(new BigDecimal("185.18"));
        history.setDate(LocalDateTime.parse("2026-10-02T12:00:00"));
        history.setNotes("Unit test");

        ConversionHistory added = historyDao.addHistory(history);

        List<ConversionHistory> histories = historyDao.getHistoryByUserId(1);
        assertEquals(3, histories.size());

        assertNotNull(added);
        assertEquals(1, added.getUserId());
        assertEquals(3, added.getFromCurrencyId());
        assertEquals(2, added.getToCurrencyId());
        assertEquals(new BigDecimal("150.00"), added.getAmount());
        assertEquals(new BigDecimal("1.23451"), added.getExchangeRate());
        assertEquals(new BigDecimal("185.18"), added.getConvertedAmount());
        assertEquals(LocalDateTime.parse("2026-10-02T12:00:00"), added.getDate());
        assertEquals("Unit test", added.getNotes());
    }

    @Test
    void getHistoryByUserId() {
        List<ConversionHistory> histories = historyDao.getHistoryByUserId(1);
        assertEquals(2, histories.size());
    }

    @Test
    void deleteHistory() {
        List<ConversionHistory> histories = historyDao.getHistoryByUserId(1);

        int historyId = histories.get(0).getHistoryId();
        historyDao.deleteHistory(historyId);
        histories = historyDao.getHistoryByUserId(1);

        assertEquals(1, histories.size());
    }

    @Test
    void deleteAllHistory() {
        historyDao.deleteAllHistory(2);

        List<ConversionHistory> histories = historyDao.getHistoryByUserId(2);

        assertEquals(0, histories.size());
    }
}