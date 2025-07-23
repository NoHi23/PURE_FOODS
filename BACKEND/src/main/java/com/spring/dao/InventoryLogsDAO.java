package com.spring.dao;

import com.spring.entity.InventoryLogs;
import java.util.List;

public interface InventoryLogsDAO {
    void addInventoryLog(InventoryLogs log);
    void updateInventoryLog(InventoryLogs log);
    List<InventoryLogs> getLogsByProductId(int productId);

    InventoryLogs getLatestLog();
    List<InventoryLogs> getAllLogs();
    InventoryLogs getLogById(int id);
    List<InventoryLogs> getAllPending();
    InventoryLogs findById(int logId);
    void update(InventoryLogs log);



    // Thêm phương thức mới cho Trader
    List<InventoryLogs> findPendingRequestsByStatus(int status);
    List<InventoryLogs> findByUserIdAndStatus(int userId, int status);

    List<InventoryLogs> getLogsByReasonAndStatus(String reason, int status);
    List<InventoryLogs> getLogsByUserId(int userId);
    List<InventoryLogs> getLogsByReason(String reason);

}