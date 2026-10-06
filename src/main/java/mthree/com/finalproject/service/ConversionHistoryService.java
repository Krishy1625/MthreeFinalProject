package mthree.com.finalproject.service;

import mthree.com.finalproject.model.ConversionHistory;

import java.util.List;

public interface ConversionHistoryService {

    ConversionHistory addHistory(ConversionHistory history);
    List<ConversionHistory> getHistoryByUserId(int userId);
    void deleteHistory(int historyId);
    void deleteAllHistory(int userId);

}
