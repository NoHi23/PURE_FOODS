package com.spring.service.Impl;

import com.spring.dao.InventoryLogsDAO;
import com.spring.dao.ProductDAO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.ProductExportSummaryDTO;
import com.spring.dto.TraderStockDTO;
import com.spring.entity.InventoryLogs;
import com.spring.entity.Products;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class InventoryLogsServiceImpl implements InventoryLogsService {

    @Autowired
    private InventoryLogsDAO inventoryLogsDAO;

    @Autowired
    private ProductDAO productDAO;

    // ===== NHÓM 1: CRUD cơ bản cho Logs =====

    @Override
    public InventoryLogsDTO createOrder(InventoryLogsDTO orderDTO) {
        InventoryLogs log = new InventoryLogs();
        log.setProductId(orderDTO.getProductId());
        log.setUserId(orderDTO.getUserId()); // Giả sử từ nhân viên kho
        log.setQuantityChange(orderDTO.getQuantityChange());
        log.setReason(orderDTO.getReason());
        log.setCreatedAt(new Date());
        log.setStatus(0); // 0: Đang xử lý
        inventoryLogsDAO.addInventoryLog(log);

        InventoryLogs savedLog = inventoryLogsDAO.getLatestLog();
        return convertToDTO(savedLog);
    }

    @Override
    public InventoryLogsDTO confirmOrder(InventoryLogsDTO orderDTO) {
        InventoryLogs log = inventoryLogsDAO.getLogById(orderDTO.getLogId());
        if (log == null) {
            throw new RuntimeException("Log not found!");
        }
        log.setStatus(orderDTO.getStatus()); // 1: Hoàn thành, 2: Từ chối
        if (log.getStatus() == 1) { // Hoàn thành
            Products product = productDAO.getProductById(log.getProductId());
            if (product != null) {
                product.setStockQuantity(product.getStockQuantity() + log.getQuantityChange());
                productDAO.updateProduct(product);
            }
        }
        inventoryLogsDAO.updateInventoryLog(log);
        return convertToDTO(log);
    }



    private InventoryLogsDTO convertToDTO(InventoryLogs log) {
        return new InventoryLogsDTO(
                log.getLogId(),
                log.getProductId(),
                log.getUserId(),
                log.getQuantityChange(),
                log.getReason(),
                log.getCreatedAt(),
                log.getStatus()
        );
    }

    // ===== NHÓM 2: Xử lý yêu cầu nhập hàng từ Importer =====

    @Override
    public List<InventoryLogsDTO> getPendingRequestsForTrader() {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByReasonAndStatus("Importer Request", 0);
        List<InventoryLogsDTO> result = new ArrayList<>();
        for (InventoryLogs log : logs) {
            result.add(convertToDTO(log));
        }
        return result;
    }

    @Override
    public List<InventoryLogsDTO> getProcessedRequestsForTrader() {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByReason("Importer Request");
        List<InventoryLogsDTO> result = new ArrayList<>();
        for (InventoryLogs log : logs) {
            if (log.getStatus() != null && (log.getStatus() == 1 || log.getStatus() == 2)) {
                result.add(convertToDTO(log));
            }
        }
        return result;
    }

    @Override
    public InventoryLogsDTO confirmShippingToImporter(InventoryLogsDTO dto) {
        InventoryLogs originalLog = inventoryLogsDAO.getLogById(dto.getLogId());
        if (originalLog == null || originalLog.getStatus() != 0)
            throw new RuntimeException("Log không tồn tại hoặc đã xử lý");

        originalLog.setStatus(1);
        inventoryLogsDAO.updateInventoryLog(originalLog);

        int traderStock = getCurrentStockForProductAndTrader(dto.getUserId(), originalLog.getProductId());
        if (traderStock < originalLog.getQuantityChange()) {
            throw new RuntimeException("Không đủ hàng trong kho của Trader để giao");
        }

        InventoryLogs shippingLog = new InventoryLogs();
        shippingLog.setProductId(originalLog.getProductId());
        shippingLog.setUserId(dto.getUserId());
        shippingLog.setQuantityChange(originalLog.getQuantityChange());
        shippingLog.setReason("Shipped by Trader");
        shippingLog.setStatus(1);
        shippingLog.setCreatedAt(new Date());

        inventoryLogsDAO.addInventoryLog(shippingLog);

        return convertToDTO(originalLog);
    }

    @Override
    public InventoryLogsDTO rejectShippingRequest(InventoryLogsDTO dto) {
        InventoryLogs log = inventoryLogsDAO.getLogById(dto.getLogId());
        if (log == null || log.getStatus() != 0)
            throw new RuntimeException("Không thể từ chối đơn này (đã xử lý hoặc không tồn tại)");

        log.setStatus(2);
        inventoryLogsDAO.updateInventoryLog(log);
        return convertToDTO(log);
    }

    // ===== NHÓM 3: Đơn trả hàng từ Importer =====

    @Override
    public InventoryLogsDTO createReturnOrder(InventoryLogsDTO dto) {
        InventoryLogs log = new InventoryLogs();
        log.setProductId(dto.getProductId());
        log.setUserId(dto.getUserId());
        log.setQuantityChange(dto.getQuantityChange());
        log.setReason("Returned from Importer");
        log.setCreatedAt(new Date());
        log.setStatus(0);
        inventoryLogsDAO.addInventoryLog(log);
        return convertToDTO(inventoryLogsDAO.getLatestLog());
    }

    @Override
    public List<InventoryLogsDTO> getPendingReturnsForTrader(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByReasonAndStatus("Returned from Importer", 0);
        List<InventoryLogsDTO> result = new ArrayList<>();
        for (InventoryLogs log : logs) {
            result.add(convertToDTO(log));
        }
        return result;
    }

    @Override
    public InventoryLogsDTO confirmReturnByTrader(InventoryLogsDTO dto) {
        InventoryLogs log = inventoryLogsDAO.getLogById(dto.getLogId());
        if (log == null || log.getStatus() != 0)
            throw new RuntimeException("Đơn trả không tồn tại hoặc đã xử lý");

        log.setStatus(1);

        Products product = productDAO.getProductById(log.getProductId());
        if (product != null) {
            product.setStockQuantity(product.getStockQuantity() + log.getQuantityChange());
            productDAO.updateProduct(product);
        }

        inventoryLogsDAO.updateInventoryLog(log);
        return convertToDTO(log);
    }

    // ===== NHÓM 4: Thống kê & Dashboard =====

    @Override
    public Map<String, Object> getTraderDashboard(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        int totalOrders = 0, confirmed = 0, rejected = 0, returned = 0, supplied = 0, stock = 0;

        for (InventoryLogs log : logs) {
            if (log.getReason() == null || log.getStatus() == null) continue;

            if ("Shipped by Trader".equals(log.getReason()) || "Rejected by Trader".equals(log.getReason())) {
                totalOrders++;
                if (log.getStatus() == 1) {
                    confirmed++;
                    supplied += log.getQuantityChange();
                    stock -= log.getQuantityChange();
                } else if (log.getStatus() == 2) rejected++;
            }
            else if ("Returned from Importer".equals(log.getReason()) && log.getStatus() == 1) {
                returned++;
                stock += log.getQuantityChange();
            }
            else if ("Inventory Import".equals(log.getReason()) && log.getStatus() == 1) {
                stock += log.getQuantityChange();
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalOrders", totalOrders);
        result.put("confirmedOrders", confirmed);
        result.put("rejectedOrders", rejected);
        result.put("returnedOrders", returned);
        result.put("totalQuantitySupplied", supplied);
        result.put("currentStock", stock);
        return result;
    }

    @Override
    public Map<String, Object> getTraderReportSummary(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        int totalOrders = logs.size(), confirmed = 0, pending = 0, rejected = 0, totalQty = 0;

        for (InventoryLogs log : logs) {
            if ("Shipped by Trader".equalsIgnoreCase(log.getReason())) {
                if (log.getStatus() != null) {
                    switch (log.getStatus()) {
                        case 0 -> pending++;
                        case 1 -> {
                            confirmed++;
                            totalQty += log.getQuantityChange();
                        }
                        case 2 -> rejected++;
                    }
                }
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("totalOrders", totalOrders);
        res.put("confirmedOrders", confirmed);
        res.put("pendingOrders", pending);
        res.put("rejectedOrders", rejected);
        res.put("totalQuantitySupplied", totalQty);
        return res;
    }

    @Override
    public List<ProductExportSummaryDTO> getTotalSuppliedPerProduct(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        Map<Integer, Integer> quantityMap = new HashMap<>();

        for (InventoryLogs log : logs) {
            if ("Shipped by Trader".equalsIgnoreCase(log.getReason()) && log.getStatus() == 1) {
                quantityMap.put(log.getProductId(), quantityMap.getOrDefault(log.getProductId(), 0) + log.getQuantityChange());
            }
        }

        List<ProductExportSummaryDTO> result = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : quantityMap.entrySet()) {
            Products product = productDAO.getProductById(entry.getKey());
            result.add(new ProductExportSummaryDTO(entry.getKey(), (product != null) ? product.getProductName() : "Unknown", entry.getValue()));
        }
        return result;
    }

    @Override
    public Map<String, Integer> getMonthlyExportSummary(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        Map<String, Integer> monthlyTotals = new TreeMap<>();

        for (InventoryLogs log : logs) {
            if ("Shipped by Trader".equalsIgnoreCase(log.getReason()) && log.getStatus() == 1) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(log.getCreatedAt());
                String key = String.format("%d-%02d", cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1);
                monthlyTotals.put(key, monthlyTotals.getOrDefault(key, 0) + log.getQuantityChange());
            }
        }
        return monthlyTotals;
    }

    // ===== NHÓM 5: Tồn kho hiện tại của Trader =====

    @Override
    public List<TraderStockDTO> getCurrentStockOfTrader(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        Map<Integer, Integer> stockMap = new HashMap<>();

        for (InventoryLogs log : logs) {
            if (log.getStatus() == null) continue;
            int pid = log.getProductId(), qty = log.getQuantityChange();
            switch (log.getReason()) {
                case "Inventory Import", "Returned from Importer" -> {
                    if (log.getStatus() == 1) stockMap.put(pid, stockMap.getOrDefault(pid, 0) + qty);
                }
                case "Shipped by Trader" -> {
                    if (log.getStatus() == 1) stockMap.put(pid, stockMap.getOrDefault(pid, 0) - qty);
                }
            }
        }

        List<TraderStockDTO> result = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : stockMap.entrySet()) {
            Products product = productDAO.getProductById(entry.getKey());
            result.add(new TraderStockDTO(entry.getKey(), (product != null) ? product.getProductName() : "Unknown", entry.getValue()));
        }
        return result;
    }

    private int getCurrentStockForProductAndTrader(int traderId, int productId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        int total = 0;
        for (InventoryLogs log : logs) {
            if (log.getProductId() != productId || log.getStatus() == null) continue;
            switch (log.getReason()) {
                case "Inventory Import", "Returned from Importer" -> {
                    if (log.getStatus() == 1) total += log.getQuantityChange();
                }
                case "Shipped by Trader" -> {
                    if (log.getStatus() == 1) total -= log.getQuantityChange();
                }
            }
        }
        return total;
    }

    // ===== NHÓM 6: Lịch sử giao hàng & logs =====

    @Override
    public List<InventoryLogsDTO> getShippingHistoryByTrader(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByUserId(traderId);
        List<InventoryLogsDTO> dtoList = new ArrayList<>();
        for (InventoryLogs log : logs) {
            if ("Shipped by Trader".equalsIgnoreCase(log.getReason()) || "Rejected by Trader".equalsIgnoreCase(log.getReason())) {
                dtoList.add(convertToDTO(log));
            }
        }
        return dtoList;
    }

    @Override
    public List<InventoryLogsDTO> getLogsByProductId(int productId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByProductId(productId);
        List<InventoryLogsDTO> dtoList = new ArrayList<>();
        for (InventoryLogs log : logs) {
            dtoList.add(convertToDTO(log));
        }
        return dtoList;
    }

    @Override
    public List<InventoryLogsDTO> getAllLogs() {
        List<InventoryLogs> logs = inventoryLogsDAO.getAllLogs(); // Giả định DAO có phương thức này
        List<InventoryLogsDTO> dtoList = new ArrayList<>();
        for (InventoryLogs log : logs) {
            dtoList.add(convertToDTO(log));
        }
        return dtoList;
    }

    @Override
    public List<InventoryLogsDTO> getAllImportRequestsForTrader() {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByReason("Importer Request");
        List<InventoryLogsDTO> result = new ArrayList<>();
        for (InventoryLogs log : logs) result.add(convertToDTO(log));
        return result;
    }
}



