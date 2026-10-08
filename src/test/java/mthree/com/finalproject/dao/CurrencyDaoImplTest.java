package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Currency;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CurrencyDaoImplTest {

    @Autowired
    private CurrencyDao currencyDao;

    @Test
    void getAllCurrencies() {
        List<Currency> currencies = currencyDao.getAllCurrencies();

        assertEquals(4, currencies.size());
    }

    @Test
    void findCurrencyByCode() {
        Currency currency = currencyDao.findCurrencyByCode("GBP");

        assertNotNull(currency);
        assertEquals("GBP", currency.getCurrencyCode());
        assertEquals("British Pound", currency.getCurrencyName());
        assertEquals("£", currency.getCurrencySymbol());
    }
}