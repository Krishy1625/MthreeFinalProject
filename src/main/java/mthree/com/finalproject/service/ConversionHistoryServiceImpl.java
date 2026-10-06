package mthree.com.finalproject.service;

import mthree.com.finalproject.dao.ConversionHistoryDao;
import mthree.com.finalproject.model.ConversionHistory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConversionHistoryServiceImpl implements ConversionHistoryService {
    private final ConversionHistoryDao historyDao;

    public ConversionHistoryServiceImpl(ConversionHistoryDao historyDao) {
        this.historyDao = historyDao;
    }
    @Override
    public ConversionHistory addHistory(ConversionHistory history) {
        if (history.getDate() == null){
            history.setDate(LocalDateTime.now());
        }
        return historyDao.addHistory(history);
    }

    @Override
    public List<ConversionHistory> getHistoryByUserId(int userId) {
        return historyDao.getHistoryByUserId(userId);
    }

    @Override
    public void deleteHistory(int historyId) {
        historyDao.deleteHistory(historyId);
    }

    public void deleteAllHistory(int userId) {
        historyDao.deleteAllHistory(userId);
    }
}
