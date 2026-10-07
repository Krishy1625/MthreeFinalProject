package mthree.com.finalproject.model;

public class Favourite {
    private int favId;
    private int userId;
    private int fromCurrencyId;
    private int toCurrencyId;
    private String fromCurrencyCode;
    private String toCurrencyCode;
    private String fromCurrencyName;
    private String toCurrencyName;

    public int getFavId() {
        return favId;
    }

    public void setFavId(int favId) {
        this.favId = favId;
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
