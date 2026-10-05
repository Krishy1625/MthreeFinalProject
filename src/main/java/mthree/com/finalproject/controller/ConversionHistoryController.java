package mthree.com.finalproject.controller;

import mthree.com.finalproject.model.ConversionHistory;
import mthree.com.finalproject.service.ConversionHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class ConversionHistoryController {

    private final ConversionHistoryService historyService;

    public ConversionHistoryController(ConversionHistoryService historyService) {
        this.historyService = historyService;
    }

    @PostMapping
    public ResponseEntity<ConversionHistory> addHistory(@RequestBody ConversionHistory history) {
        ConversionHistory saved = historyService.addHistory(history);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/user/{userId}")
    public List<ConversionHistory> getHistory(@PathVariable int userId) {
        return historyService.getHistoryByUserId(userId);
    }
}
