package mthree.com.finalproject.service;

import mthree.com.finalproject.model.ConversionResult;
import mthree.com.finalproject.model.Currency;

import java.math.BigDecimal;
import java.util.List;

public interface CurrencyService {
    List<Currency> getAllCurrencies();
    Currency findCurrencyByCode(String code);

    ConversionResult convert(
            BigDecimal amount,
            String fromCurrency,
            String toCurrency
    );
}
