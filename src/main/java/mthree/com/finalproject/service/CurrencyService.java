package mthree.com.finalproject.service;

import mthree.com.finalproject.model.Currency;

import java.util.List;

public interface CurrencyService {
    List<Currency> getAllCurrencies();
    Currency findCurrencyByCode(String code);
}
