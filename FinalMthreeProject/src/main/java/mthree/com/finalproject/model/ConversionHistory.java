package mthree.com.finalproject.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ConversionHistory {
    private int historyId;
    private int fromCurrencyId;
    private int toCurrencyId;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
    private BigDecimal convertedAmount;
    private LocalDate date;

    public int getHistoryId() {
        return historyId;
    }

    public void setHistoryId(int historyId) {
        this.historyId = historyId;
    }

    public int getFromCurrencyId() {
        return fromCurrencyId;
    }

    public void setFromCurrencyId(int fromCurrencyId) {
        this.fromCurrencyId = fromCurrencyId;
    }

    public int getToCurrencyId() {
        return toCurrencyId;
    }

    public void setToCurrencyId(int toCurrencyId) {
        this.toCurrencyId = toCurrencyId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
