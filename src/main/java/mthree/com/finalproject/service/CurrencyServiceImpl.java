package mthree.com.finalproject.service;

import mthree.com.finalproject.dao.CurrencyDao;
import mthree.com.finalproject.model.ConversionResult;
import mthree.com.finalproject.model.Currency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    private final CurrencyDao currencyDao;

    @Value("${unirate.api.key}")
    private String apiKey;

    @Value("${unirate.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

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

    @Override
    public ConversionResult convert(BigDecimal amount,
                                    String fromCurrency,
                                    String toCurrency) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero.");
        }

        String from = fromCurrency.toUpperCase();
        String to = toCurrency.toUpperCase();

        String url = apiUrl
                + "?api_key=" + apiKey
                + "&from=" + from
                + "&to=" + to;

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null || response.get("rate") == null) {
            throw new RuntimeException("Could not retrieve exchange rate.");
        }

        BigDecimal rate =
                new BigDecimal(response.get("rate").toString());

        BigDecimal convertedAmount = amount
                .multiply(rate)
                .setScale(2, RoundingMode.HALF_UP);

        return new ConversionResult(
                amount,
                from,
                to,
                rate,
                convertedAmount
        );
    }
}
