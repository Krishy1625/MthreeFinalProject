package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Currency;
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
class CurrencyDaoImplTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private CurrencyDaoImpl currencyDao;

    @BeforeEach
    void setUp() {
        currencyDao = new CurrencyDaoImpl(jdbcTemplate);
    }

    @Test
    void getAllCurrenciesReturnsQueryResults() {
        List<Currency> expected = List.of(new Currency());
        when(jdbcTemplate.query(any(String.class), any(RowMapper.class))).thenReturn(expected);

        List<Currency> result = currencyDao.getAllCurrencies();

        assertSame(expected, result);
        verify(jdbcTemplate).query(eq("SELECT * FROM currency ORDER BY cid"), any(RowMapper.class));
    }

    @Test
    void findCurrencyByCodeQueriesForCurrencyCode() {
        Currency expected = new Currency();
        when(jdbcTemplate.queryForObject(any(String.class), any(RowMapper.class), eq("GBP")))
                .thenReturn(expected);

        Currency result = currencyDao.findCurrencyByCode("GBP");

        assertSame(expected, result);
        verify(jdbcTemplate).queryForObject(
                eq("SELECT * FROM currency WHERE currency_code = ?"), any(RowMapper.class), eq("GBP")
        );
    }
}
