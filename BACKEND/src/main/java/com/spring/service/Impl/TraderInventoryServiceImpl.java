package com.spring.service.Impl;

import com.spring.dao.TraderInventoryLogsDAO;
import com.spring.dao.TraderProductsDAO;
import com.spring.dao.InventoryLogsDAO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.TraderStockDTO;
import com.spring.entity.InventoryLogs;
import com.spring.entity.TraderInventoryLogs;
import com.spring.entity.TraderProducts;
import com.spring.service.TraderInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class TraderInventoryServiceImpl implements TraderInventoryService {

    @Autowired
    private TraderProductsDAO traderProductsDAO;
    @Autowired
    private TraderInventoryLogsDAO traderInventoryLogsDAO;
    @Autowired
    private InventoryLogsDAO inventoryLogsDAO;

    private int getCurrentTraderId() {
        // Placeholder, thay bằng logic thực tế của nhóm bạn
        // Ví dụ: return userService.getCurrentUserId();
        return 3; // Mặc định tạm thời
    }

    // ===== NHÓM 1: CRUD cơ bản cho Logs của Trader =====
    @Override
    public TraderInventoryLogs createTraderStockUpdate(int traderId, int productId, int quantityChange) {
        TraderInventoryLogs log = new TraderInventoryLogs();
        log.setTraderProductId(productId);
        log.setUserId(traderId);
        log.setQuantityChange(quantityChange);
        log.setCreatedAt(new Date());
        log.setStatus(0); // Gửi yêu cầu cập nhật
        return traderInventoryLogsDAO.createTraderInventoryLog(log);
    }

    @Override
    public TraderInventoryLogs confirmTraderStockUpdate(int logId, int traderId) {
        TraderInventoryLogs log = traderInventoryLogsDAO.getTraderInventoryLogById(logId);
        if (log == null || log.getStatus() != 0 || log.getUserId() != traderId) {
            throw new RuntimeException("Không có quyền hoặc đã xử lý");
        }
        log.setStatus(1); // Xác nhận
        TraderProducts product = traderProductsDAO.getTraderProductById(log.getTraderProductId());
        if (product == null || product.getUserId() != traderId) {
            throw new RuntimeException("Sản phẩm không thuộc Trader");
        }
        product.setCurrentStockQuantity(product.getCurrentStockQuantity() + log.getQuantityChange());
        product.setLastUpdated(new Date());
        traderInventoryLogsDAO.updateTraderInventoryLog(log);
        traderProductsDAO.updateTraderProduct(product);
        return log;
    }



    @Override
    public List<TraderInventoryLogs> getAllTraderInventoryLogs(int traderId) {
        List<TraderInventoryLogs> logs = traderInventoryLogsDAO.getAllTraderInventoryLogs();
        List<TraderInventoryLogs> filteredLogs = new ArrayList<>();
        for (TraderInventoryLogs log : logs) {
            if (log.getUserId() == traderId) {
                filteredLogs.add(log);
            }
        }
        return filteredLogs;
    }

    // ===== NHÓM 2: Quản lý tồn kho =====
    @Override
    public List<TraderStockDTO> getCurrentStockOfTrader(int traderId) {
        List<TraderProducts> products = traderProductsDAO.getAllTraderProducts();
        List<TraderStockDTO> result = new ArrayList<>();
        for (TraderProducts product : products) {
            if (product.getUserId() == traderId) {
                result.add(new TraderStockDTO(
                        product.getTraderProductId(),
                        product.getProductName(),
                        product.getCurrentStockQuantity()
                ));
            }
        }
        return result;
    }

    @Override
    public TraderInventoryLogs traderCreateInventoryImport(int traderId, int productId, int quantityChange) {
        TraderInventoryLogs log = new TraderInventoryLogs();
        log.setTraderProductId(productId);
        log.setUserId(traderId);
        log.setQuantityChange(quantityChange);
        log.setCreatedAt(new Date());
        log.setStatus(1); // Xác nhận ngay
        traderInventoryLogsDAO.createTraderInventoryLog(log);

        TraderProducts product = traderProductsDAO.getTraderProductById(productId);
        if (product == null || product.getUserId() != traderId) {
            throw new RuntimeException("Sản phẩm không thuộc Trader");
        }
        product.setCurrentStockQuantity(product.getCurrentStockQuantity() + quantityChange);
        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);
        return log;
    }

    // ===== NHÓM 3: Xử lý yêu cầu từ Importer =====
    @Override
    public List<InventoryLogsDTO> getPendingRequestsFromImporter(int traderId) {
        List<InventoryLogs> pendingRequests = inventoryLogsDAO.findPendingRequestsByStatus(0);
        List<InventoryLogsDTO> requests = new ArrayList<>();
        for (InventoryLogs log : pendingRequests) {
            TraderProducts product = traderProductsDAO.getTraderProductById(log.getProductId());
            if (product != null && product.getUserId() == traderId) {
                requests.add(convertToDTO(log));
            }
        }
        return requests;
    }

    @Override
    public InventoryLogsDTO confirmShippingToImporter(int logId, int traderId) {
        InventoryLogs log = inventoryLogsDAO.getLogById(logId);
        if (log == null || log.getStatus() != 0) {
            throw new RuntimeException("Yêu cầu không hợp lệ hoặc đã xử lý");
        }

        log.setStatus(1); // Xác nhận
        inventoryLogsDAO.updateInventoryLog(log);

        TraderProducts product = traderProductsDAO.getTraderProductById(log.getProductId());
        if (product == null || product.getUserId() != traderId) {
            throw new RuntimeException("Sản phẩm không thuộc Trader");
        }
        if (product.getCurrentStockQuantity() < log.getQuantityChange()) {
            throw new RuntimeException("Không đủ hàng trong kho");
        }
        product.setCurrentStockQuantity(product.getCurrentStockQuantity() - log.getQuantityChange());
        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);

        return convertToDTO(log);
    }

    @Override
    public InventoryLogsDTO rejectShippingToImporter(int logId, int traderId) {
        InventoryLogs log = inventoryLogsDAO.getLogById(logId);
        if (log == null || log.getStatus() != 0) {
            throw new RuntimeException("Yêu cầu không hợp lệ hoặc đã xử lý");
        }

        log.setStatus(2); // Từ chối
        inventoryLogsDAO.updateInventoryLog(log);

        return convertToDTO(log);
    }
    @Override
    public TraderStockDTO addStockToProduct(int userId, int productId, int quantityToAdd) {
        TraderProducts product = traderProductsDAO.getTraderProductById(productId);
        if (product == null || product.getUserId() != userId) {
            throw new RuntimeException("Sản phẩm không thuộc Trader hoặc không tồn tại");
        }
        if (quantityToAdd <= 0) {
            throw new RuntimeException("Số lượng thêm phải lớn hơn 0");
        }
        product.setCurrentStockQuantity(product.getCurrentStockQuantity() + quantityToAdd);
        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);
        return new TraderStockDTO(product.getTraderProductId(), product.getProductName(), product.getCurrentStockQuantity());
    }

    @Override
    public TraderStockDTO createNewProduct(int userId, String productName, double price, int initialStockQuantity, String warehouseLocation) {
        // Kiểm tra dữ liệu đầu vào
        if (productName == null || productName.trim().isEmpty()) {
            throw new RuntimeException("Tên sản phẩm không được để trống");
        }
        if (initialStockQuantity < 0) {
            throw new RuntimeException("Số lượng ban đầu phải không âm");
        }
        if (warehouseLocation == null || warehouseLocation.trim().isEmpty()) {
            throw new RuntimeException("Địa điểm kho không được để trống");
        }

        TraderProducts product = new TraderProducts();
        product.setUserId(userId);
        product.setProductName(productName.trim());
        product.setPrice(price);
        product.setInitialStockQuantity(initialStockQuantity);
        product.setCurrentStockQuantity(initialStockQuantity);
        product.setWarehouseLocation(warehouseLocation.trim());
        product.setStatus(1); // Giả định sẵn sàng
        product.setCreatedAt(new Date());
        product.setLastUpdated(new Date());
        traderProductsDAO.createTraderProduct(product);
        return new TraderStockDTO(product.getTraderProductId(), productName, initialStockQuantity);
    }

    private InventoryLogsDTO convertToDTO(InventoryLogs log) {
        if (log == null) {
            throw new RuntimeException("Log không tồn tại");
        }
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
}