package com.spring.service;

import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.ProductExportSummaryDTO;
import com.spring.dto.TraderStockDTO;
import java.util.List;
import java.util.Map;


public interface InventoryLogsService {
    List<InventoryLogsDTO> getLogsByProductId(int productId);
    List<InventoryLogsDTO> getAllLogs();

    InventoryLogsDTO createOrder(InventoryLogsDTO orderDTO);
    InventoryLogsDTO confirmOrder(InventoryLogsDTO orderDTO);

    List<InventoryLogsDTO> getPendingRequestsForTrader();
    InventoryLogsDTO confirmShippingToImporter(InventoryLogsDTO dto);
    Map<String, Object> getTraderReportSummary(int traderId);

    List<InventoryLogsDTO> getShippingHistoryByTrader(int traderId);
    List<ProductExportSummaryDTO> getTotalSuppliedPerProduct(int traderId);
    InventoryLogsDTO rejectShippingRequest(InventoryLogsDTO dto);
    List<TraderStockDTO> getCurrentStockOfTrader(int traderId);

    InventoryLogsDTO createReturnOrder(InventoryLogsDTO dto);
    InventoryLogsDTO confirmReturnByTrader(InventoryLogsDTO dto);
    List<InventoryLogsDTO> getPendingReturnsForTrader(int traderId);
    List<InventoryLogsDTO> getProcessedRequestsForTrader();

    Map<String, Object> getTraderDashboard(int traderId);
    Map<String, Integer> getMonthlyExportSummary(int traderId);

    List<InventoryLogsDTO> getAllImportRequestsForTrader();




}