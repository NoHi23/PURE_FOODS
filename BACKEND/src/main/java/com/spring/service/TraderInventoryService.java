package com.spring.service;

import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.TraderStockDTO;
import com.spring.entity.TraderInventoryLogs;

import java.util.List;

public interface TraderInventoryService {
    // NHÓM 1: CRUD cơ bản cho Logs của Trader
    TraderInventoryLogs createTraderStockUpdate(int traderId, int productId, int quantityChange);
    TraderInventoryLogs confirmTraderStockUpdate(int logId, int traderId);

    List<TraderInventoryLogs> getAllTraderInventoryLogs(int traderId);

    // NHÓM 2: Quản lý tồn kho
    List<TraderStockDTO> getCurrentStockOfTrader(int traderId);
    TraderInventoryLogs traderCreateInventoryImport(int traderId, int productId, int quantityChange);
    TraderStockDTO addStockToProduct(int userId, int productId, int quantityToAdd);
    TraderStockDTO createNewProduct(int userId, String productName, double price, int initialStockQuantity, String warehouseLocation);

    // NHÓM 3: Xử lý yêu cầu từ Importer
    List<InventoryLogsDTO> getPendingRequestsFromImporter(int traderId);
    InventoryLogsDTO confirmShippingToImporter(int logId, int traderId);
    InventoryLogsDTO rejectShippingToImporter(int logId, int traderId);
}