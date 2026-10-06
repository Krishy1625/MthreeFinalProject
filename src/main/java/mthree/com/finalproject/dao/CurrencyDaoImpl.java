package mthree.com.finalproject.dao;

import mthree.com.finalproject.dao.mappers.CurrencyMapper;
import mthree.com.finalproject.model.Currency;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CurrencyDaoImpl implements CurrencyDao {

    private final JdbcTemplate jdbcTemplate;

    public CurrencyDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // get the list of all available currencies
    @Override
    public List<Currency> getAllCurrencies() {
        final String GET_ALL_CURRENCIES = "SELECT * FROM currency ORDER BY currency_code";
        return jdbcTemplate.query(GET_ALL_CURRENCIES, new CurrencyMapper());
    }

    // find a specific currency in db
    // may throw exception if there is no such currency in DB
    @Override
    public Currency findCurrencyByCode(String code) {
        final String FIND_CURRENCY_BY_CODE = "SELECT * FROM currency WHERE currency_code = ?";
        return jdbcTemplate.queryForObject(FIND_CURRENCY_BY_CODE, new CurrencyMapper(), code);
    }
}
