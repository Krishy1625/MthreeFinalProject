package mthree.com.finalproject.service;

import mthree.com.finalproject.dao.CurrencyDao;
import mthree.com.finalproject.model.Currency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    private final CurrencyDao currencyDao;

    public CurrencyServiceImpl(CurrencyDao currencyDao) {
        this.currencyDao = currencyDao;
    }

    @Override
    public List<Currency> getAllCurrencies() {
        return currencyDao.getAllCurrencies();
    }

    @Override
    public Currency findCurrencyByCode(String code) {
        return currencyDao.findCurrencyByCode(code.toUpperCase());
    }
}
