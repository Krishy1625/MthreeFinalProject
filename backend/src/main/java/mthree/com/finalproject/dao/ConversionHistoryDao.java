package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.ConversionHistory;

import java.util.List;

public interface ConversionHistoryDao {

    ConversionHistory addHistory(ConversionHistory history);

    List<ConversionHistory> getHistoryByUserId(int userId);

    void deleteHistory(int historyId);

    void deleteAllHistory(int userId);

}
