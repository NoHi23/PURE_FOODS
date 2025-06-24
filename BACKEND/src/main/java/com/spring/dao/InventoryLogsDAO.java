package com.spring.dao;

import com.spring.entity.InventoryLogs;
import java.util.List;

public interface InventoryLogsDAO {
    void addInventoryLog(InventoryLogs log);
    List<InventoryLogs> getLogsByProductId(int productId);

    InventoryLogs getLatestLog();
}