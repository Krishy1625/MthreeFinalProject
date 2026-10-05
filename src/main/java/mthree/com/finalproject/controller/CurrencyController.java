package mthree.com.finalproject.controller;

import mthree.com.finalproject.model.Currency;
import mthree.com.finalproject.service.CurrencyService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public class CurrencyController {
    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping
    public List<Currency> getAllCurrencies() {
        return currencyService.getAllCurrencies();
    }

    @GetMapping("/{code}")
    public ResponseEntity<?> getCurrencyByCode(@PathVariable String code) {
        try{
            Currency currency = currencyService.findCurrencyByCode(code);
            return ResponseEntity.ok(currency);
        }
        catch (EmptyResultDataAccessException exception){
            return ResponseEntity.notFound().build();
        }
    }
}
