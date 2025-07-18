package com.spring.dao;

import com.spring.entity.TraderInventoryLogs;
import java.util.List;

public interface TraderInventoryLogsDAO {
    TraderInventoryLogs getTraderInventoryLogById(int id);
    List<TraderInventoryLogs> getAllTraderInventoryLogs();
    TraderInventoryLogs createTraderInventoryLog(TraderInventoryLogs traderInventoryLog);
    TraderInventoryLogs updateTraderInventoryLog(TraderInventoryLogs traderInventoryLog);
    void deleteTraderInventoryLog(int id);

    // Thêm phương thức getLatestLog
    TraderInventoryLogs getLatestLog();
}