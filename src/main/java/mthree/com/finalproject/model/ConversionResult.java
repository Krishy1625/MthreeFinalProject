package mthree.com.finalproject.model;

import java.math.BigDecimal;

public class ConversionResult {

    private BigDecimal amount;
    private String fromCurrency;
    private String toCurrency;
    private BigDecimal exchangeRate;
    private BigDecimal convertedAmount;

    public ConversionResult() {
    }

    public ConversionResult(BigDecimal amount,
                            String fromCurrency,
                            String toCurrency,
                            BigDecimal exchangeRate,
                            BigDecimal convertedAmount) {
        this.amount = amount;
        this.fromCurrency = fromCurrency;
        this.toCurrency = toCurrency;
        this.exchangeRate = exchangeRate;
        this.convertedAmount = convertedAmount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getFromCurrency() {
        return fromCurrency;
    }

    public void setFromCurrency(String fromCurrency) {
        this.fromCurrency = fromCurrency;
    }

    public String getToCurrency() {
        return toCurrency;
    }

    public void setToCurrency(String toCurrency) {
        this.toCurrency = toCurrency;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public BigDecimal getConvertedAmount() {
        return convertedAmount;
    }

    public void setConvertedAmount(BigDecimal convertedAmount) {
        this.convertedAmount = convertedAmount;
    }
}