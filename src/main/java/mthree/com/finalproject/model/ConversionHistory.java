package mthree.com.finalproject.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ConversionHistory {
    private int historyId;
    private int userId;
    private int fromCurrencyId;
    private int toCurrencyId;
    private BigDecimal amount;
    private BigDecimal exchangeRate;
    private BigDecimal convertedAmount;
    private LocalDateTime conversionDate;
    private String notes;
    private String fromCurrencyCode;
    private String toCurrencyCode;
    private String fromCurrencyName;
    private String toCurrencyName;

    public int getHistoryId() {
        return historyId;
    }

    public void setHistoryId(int historyId) {
        this.historyId = historyId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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

    public LocalDateTime getDate() {
        return conversionDate;
    }

    public void setDate(LocalDateTime conversionDate) {
        this.conversionDate = conversionDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getFromCurrencyCode() {
        return fromCurrencyCode;
    }

    public void setFromCurrencyCode(String fromCurrencyCode) {
        this.fromCurrencyCode = fromCurrencyCode;
    }

    public String getToCurrencyCode() {
        return toCurrencyCode;
    }

    public void setToCurrencyCode(String toCurrencyCode) {
        this.toCurrencyCode = toCurrencyCode;
    }

    public String getFromCurrencyName() {
        return fromCurrencyName;
    }

    public void setFromCurrencyName(String fromCurrencyName) {
        this.fromCurrencyName = fromCurrencyName;
    }

    public String getToCurrencyName() {
        return toCurrencyName;
    }

    public void setToCurrencyName(String toCurrencyName) {
        this.toCurrencyName = toCurrencyName;
    }
}
