package mthree.com.finalproject.controller;

import mthree.com.finalproject.model.ConversionResult;
import mthree.com.finalproject.model.Currency;
import mthree.com.finalproject.service.CurrencyService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/currencies")
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
        try {
            Currency currency = currencyService.findCurrencyByCode(code);
            return ResponseEntity.ok(currency);
        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(exception.getMessage());
        }
    }

    @PostMapping("/convert")
    public ResponseEntity<?> convert(
            @RequestParam BigDecimal amount,
            @RequestParam String from,
            @RequestParam String to) {

        try {
            ConversionResult result =
                    currencyService.convert(amount, from, to);

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(exception.getMessage());

        } catch (Exception exception) {
            return ResponseEntity.internalServerError()
                    .body("Unable to complete conversion.");
        }
    }
}
