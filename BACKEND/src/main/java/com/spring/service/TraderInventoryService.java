package com.spring.service;

import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.TraderStockDTO;

import java.util.List;
import java.util.Map;

public interface TraderInventoryService {
    // NHÓM 1: CRUD cơ bản cho Logs của Trader


    // NHÓM 2: Quản lý tồn kho
    List<TraderStockDTO> getCurrentStockOfTrader(int traderId);

    TraderStockDTO addStockToProduct(int userId, int productId, int quantityToAdd);
    TraderStockDTO createNewProduct(int userId, String productName, double price, int initialStockQuantity, String warehouseLocation, String imageURL);

    // NHÓM 3: Xử lý yêu cầu từ Importer
    List<InventoryLogsDTO> getPendingRequestsFromImporter(int traderId);
    InventoryLogsDTO confirmShippingToImporter(int logId, int traderId);
    InventoryLogsDTO rejectShippingToImporter(int logId, int userId, String reason);
    List<InventoryLogsDTO> getAllLogsOfTrader(int traderId);
    //Xử lí đơn trả hàng
    List<InventoryLogsDTO> getReturnRequestsFromImporter(int traderId);
    InventoryLogsDTO confirmReturnFromImporter(int logId, int traderId);
    InventoryLogsDTO rejectReturnFromImporter(int logId, int traderId, String reason);
    List<InventoryLogsDTO> getReturnLogsOfTrader(int traderId);


    TraderStockDTO updateProduct(int userId, int productId, String productName, double price, String warehouseLocation, String imageURL);

    void deleteProduct(int userId, int productId);

    TraderStockDTO updateProductStatus(int userId, int traderProductId, int status);

    Map<String, Object> getTraderReportSummary(int traderId);

    List<Map<String, Object>> getMonthlyReport(int traderId);

    List<Map<String, Object>> getProductReport(int traderId);
}