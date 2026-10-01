package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Currency;

import java.util.List;

public interface CurrencyDao {

    List<Currency> getAllCurrencies();

    Currency findCurrencyByCode(String code);
}
