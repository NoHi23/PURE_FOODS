package com.spring.service.Impl;

import com.spring.dao.TraderProductsDAO;
import com.spring.dao.TraderProductMappingDAO;
import com.spring.dao.InventoryLogsDAO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.TraderStockDTO;
import com.spring.entity.InventoryLogs;
import com.spring.entity.TraderProducts;
import com.spring.entity.TraderProductMapping;
import com.spring.service.TraderInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import java.time.ZoneId;



@Service
@Transactional(propagation = Propagation.REQUIRED)
public class TraderInventoryServiceImpl implements TraderInventoryService {

    @Autowired
    private TraderProductsDAO traderProductsDAO;

    @Autowired
    private InventoryLogsDAO inventoryLogsDAO;
    @Autowired
    private TraderProductMappingDAO traderProductMappingDAO;
    private int getCurrentTraderId() {
        // Placeholder, thay bằng logic thực tế của nhóm bạn
        // Ví dụ: return userService.getCurrentUserId();
        return 3; // Mặc định tạm thời
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
                        product.getCurrentStockQuantity(),
                        product.getImageURL(),
                        product.getPrice() ,
                        product.getStatus()
                ));
            }
        }
        return result;
    }


    // ===== NHÓM 3: Xử lý yêu cầu từ Importer =====
    @Override
    public List<InventoryLogsDTO> getPendingRequestsFromImporter(int traderId) {
        List<InventoryLogs> pendingLogs = inventoryLogsDAO.getAllPending();
        List<InventoryLogsDTO> result = new ArrayList<>();

        for (InventoryLogs log : pendingLogs) {
            TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);

            if (mapping != null) {
                InventoryLogsDTO dto = new InventoryLogsDTO();
                dto.setLogId(log.getLogId());
                dto.setProductId(log.getProductId());
                dto.setUserId(log.getUserId());
                dto.setQuantityChange(log.getQuantityChange());
                dto.setReason(log.getReason());
                dto.setCreatedAt(log.getCreatedAt());
                dto.setStatus(log.getStatus());

                result.add(dto);
            }
        }

        return result;
    }




    @Override
    public InventoryLogsDTO confirmShippingToImporter(int logId, int traderId) {
        InventoryLogs log = inventoryLogsDAO.getLogById(logId);
        if (log == null || log.getStatus() != 0) {
            throw new RuntimeException("Yêu cầu không hợp lệ hoặc đã xử lý");
        }

        // Kiểm tra quyền sở hữu sản phẩm qua mapping
        TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
        if (mapping == null) {
            throw new RuntimeException("Sản phẩm không thuộc Trader hoặc không tồn tại");
        }

        // Lấy thông tin sản phẩm thực tế bằng traderProductId từ mapping
        TraderProducts product = traderProductsDAO.getTraderProductById(mapping.getTraderProductId());
        if (product == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm từ traderProductId: " + mapping.getTraderProductId());
        }

        // Kiểm tra số lượng tồn kho
        if (product.getCurrentStockQuantity() < log.getQuantityChange()) {
            throw new RuntimeException("Không đủ hàng trong kho: " + product.getProductName());
        }

        // Cập nhật trạng thái log và sản phẩm
        log.setStatus(1); // Xác nhận
        inventoryLogsDAO.updateInventoryLog(log);

        product.setCurrentStockQuantity(product.getCurrentStockQuantity() - log.getQuantityChange());
        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);

        return convertToDTO(log);
    }


    @Override
    public InventoryLogsDTO rejectShippingToImporter(int logId, int traderId, String reason) {
        InventoryLogs log = inventoryLogsDAO.findById(logId);

        if (log == null) {
            throw new RuntimeException("Đơn hàng không tồn tại");
        }

        // Kiểm tra quyền sở hữu sản phẩm qua mapping
        TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
        if (mapping == null) {
            throw new RuntimeException("Sản phẩm không thuộc Trader này");
        }

        if (log.getStatus() != 0) {
            throw new RuntimeException("Chỉ có thể từ chối đơn hàng đang chờ xử lý");
        }

        log.setStatus(2); // 2 = Từ chối
        log.setReason(reason + " (Đã từ chối)");
        inventoryLogsDAO.update(log);

        return convertToDTO(log);
    }

    @Override
    public List<InventoryLogsDTO> getReturnRequestsFromImporter(int traderId) {
        List<InventoryLogs> allLogs = inventoryLogsDAO.getAllLogs();
        List<InventoryLogsDTO> result = new ArrayList<>();

        for (InventoryLogs log : allLogs) {
            if (log.getStatus() == 5) {
                TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
                if (mapping != null) {
                    result.add(convertToDTO(log));
                }
            }
        }
        return result;
    }

    @Override
    public InventoryLogsDTO confirmReturnFromImporter(int logId, int traderId) {
        InventoryLogs log = inventoryLogsDAO.getLogById(logId);
        if (log == null || log.getStatus() != 5) {
            throw new RuntimeException("Đơn trả hàng không hợp lệ hoặc đã xử lý");
        }

        TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
        if (mapping == null) {
            throw new RuntimeException("Sản phẩm không thuộc quyền sở hữu của Trader");
        }

        TraderProducts product = traderProductsDAO.getTraderProductById(mapping.getTraderProductId());
        if (product == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm từ mapping");
        }

        // Cập nhật tồn kho và trạng thái
        product.setCurrentStockQuantity(product.getCurrentStockQuantity() + log.getQuantityChange());
        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);

        log.setStatus(6); // Xác nhận trả hàng
        inventoryLogsDAO.update(log);

        return convertToDTO(log);
    }

    @Override
    public InventoryLogsDTO rejectReturnFromImporter(int logId, int traderId, String reason) {
        InventoryLogs log = inventoryLogsDAO.getLogById(logId);
        if (log == null || log.getStatus() != 5) {
            throw new RuntimeException("Đơn trả hàng không hợp lệ hoặc đã xử lý");
        }

        TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
        if (mapping == null) {
            throw new RuntimeException("Không có quyền xử lý đơn hàng này");
        }

        log.setStatus(7); // Từ chối trả hàng
        log.setReason(reason + " (Từ chối trả hàng)");
        inventoryLogsDAO.update(log);

        return convertToDTO(log);
    }




    @Override
    public List<InventoryLogsDTO> getAllLogsOfTrader(int traderId) {
        List<InventoryLogs> allLogs = inventoryLogsDAO.getAllLogs(); // Lấy toàn bộ logs
        List<InventoryLogsDTO> result = new ArrayList<>();

        for (InventoryLogs log : allLogs) {
            // Lọc log có status đã xử lý (1: xác nhận, 2: từ chối) và thuộc Trader này
            if ((log.getStatus() == 1 || log.getStatus() == 2)) {
                TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
                if (mapping != null) {
                    result.add(convertToDTO(log));
                }
            }
        }

        return result;
    }

    @Override
    public List<InventoryLogsDTO> getReturnLogsOfTrader(int traderId) {
        List<InventoryLogs> allLogs = inventoryLogsDAO.getAllLogs(); // Lấy toàn bộ logs
        List<InventoryLogsDTO> result = new ArrayList<>();

        for (InventoryLogs log : allLogs) {
            int status = log.getStatus();

            // Chỉ lấy đơn trả hàng đã xử lý (status 6: chấp nhận, 7: từ chối)
            if (status == 6 || status == 7) {
                TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
                if (mapping != null) {
                    result.add(convertToDTO(log));
                }
            }
        }

        return result;
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
        return new TraderStockDTO(product.getTraderProductId(), product.getProductName(), product.getCurrentStockQuantity(), product.getImageURL());
    }

    @Override
    public TraderStockDTO createNewProduct(int userId, String productName, double price, int initialStockQuantity, String warehouseLocation, String imageURL) {
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
        product.setImageURL(imageURL); // Lưu imageURL
        traderProductsDAO.createTraderProduct(product);
        return new TraderStockDTO(product.getTraderProductId(), productName, initialStockQuantity, imageURL);
    }

    @Override
    public TraderStockDTO updateProduct(int userId, int productId, String productName, double price, String warehouseLocation, String imageURL ) {
        TraderProducts product = traderProductsDAO.getTraderProductById(productId);
        if (product == null || product.getUserId() != userId) {
            throw new RuntimeException("Sản phẩm không tồn tại hoặc không thuộc Trader");
        }

        if (productName != null && !productName.trim().isEmpty()) product.setProductName(productName.trim());
        if (price >= 0) product.setPrice(price);
        if (warehouseLocation != null && !warehouseLocation.trim().isEmpty()) product.setWarehouseLocation(warehouseLocation.trim());
        if (imageURL != null) product.setImageURL(imageURL);

        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);

        return new TraderStockDTO(product.getTraderProductId(), product.getProductName(), product.getCurrentStockQuantity(), product.getImageURL(),product.getPrice(),product.getStatus());
    }

    @Override
    public void deleteProduct(int userId, int productId) {
        TraderProducts product = traderProductsDAO.getTraderProductById(productId);
        if (product == null || product.getUserId() != userId) {
            throw new RuntimeException("Không tìm thấy sản phẩm hoặc không có quyền xóa");
        }

        traderProductsDAO.deleteTraderProduct(productId);
    }
    // Thêm phương thức cập nhật trạng thái
    @Override
    public TraderStockDTO updateProductStatus(int userId, int traderProductId, int status) {
        TraderProducts product = traderProductsDAO.getTraderProductById(traderProductId);
        if (product == null || product.getUserId() != userId) {
            throw new RuntimeException("Sản phẩm không tồn tại hoặc không thuộc Trader");
        }
        if (status != 0 && status != 1) {
            throw new RuntimeException("Trạng thái không hợp lệ, chỉ chấp nhận 0 (inactive) hoặc 1 (active)");
        }

        product.setStatus(status);

        // ✅ Nếu vô hiệu hoá thì set tồn kho về 0
        if (status == 0) {
            product.setCurrentStockQuantity(0);
        }

        product.setLastUpdated(new Date());
        traderProductsDAO.updateTraderProduct(product);

        return new TraderStockDTO(
                product.getTraderProductId(),
                product.getProductName(),
                product.getCurrentStockQuantity(),
                product.getImageURL(),
                product.getPrice(),
                product.getStatus()
        );
    }
    @Override
    public Map<String, Object> getTraderReportSummary(int traderId) {
        Map<String, Object> result = new HashMap<>();

        List<InventoryLogs> allLogs = inventoryLogsDAO.getAllLogs();
        List<TraderProducts> products = traderProductsDAO.getAllTraderProducts();

        int totalOrders = 0, confirmedOrders = 0, rejectedOrders = 0, returnedOrders = 0, totalShippedQuantity = 0;
        int currentStock = 0;

        for (InventoryLogs log : allLogs) {
            TraderProductMapping mapping = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
            if (mapping == null) continue;

            int status = log.getStatus();
            totalOrders += (status == 1 || status == 2) ? 1 : 0;
            confirmedOrders += (status == 1) ? 1 : 0;
            rejectedOrders += (status == 2) ? 1 : 0;
            returnedOrders += (status == 6 || status == 7) ? 1 : 0;
            totalShippedQuantity += (status == 1) ? log.getQuantityChange() : 0;
        }

        for (TraderProducts p : products) {
            if (p.getUserId() == traderId && p.getStatus() == 1) {
                currentStock += p.getCurrentStockQuantity();
            }
        }

        result.put("totalOrders", totalOrders);
        result.put("confirmedOrders", confirmedOrders);
        result.put("rejectedOrders", rejectedOrders);
        result.put("returnedOrders", returnedOrders);
        result.put("totalShippedQuantity", totalShippedQuantity);
        result.put("currentStock", currentStock);

        return result;
    }
    @Override
    public List<Map<String, Object>> getMonthlyReport(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getAllLogs();
        Map<String, Integer> monthlyTotals = new HashMap<>();

        for (InventoryLogs log : logs) {
            if (log.getStatus() != 1) continue;
            TraderProductMapping map = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
            if (map == null) continue;

            LocalDateTime createdAt = log.getCreatedAt().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            String key = createdAt.getYear() + "-" + String.format("%02d", createdAt.getMonthValue());
            monthlyTotals.put(key, monthlyTotals.getOrDefault(key, 0) + log.getQuantityChange());
        }

        return monthlyTotals.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("month", entry.getKey());
                    result.put("quantity", entry.getValue());
                    return result;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getProductReport(int traderId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getAllLogs();
        Map<Integer, Integer> productQuantities = new HashMap<>();

        for (InventoryLogs log : logs) {
            if (log.getStatus() != 1) continue;

            TraderProductMapping map = traderProductMappingDAO.getByProductIdAndTraderId(log.getProductId(), traderId);
            if (map == null) continue;

            int traderProductId = map.getTraderProductId();

            productQuantities.put(traderProductId,
                    productQuantities.getOrDefault(traderProductId, 0) + log.getQuantityChange());
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : productQuantities.entrySet()) {
            int traderProductId = entry.getKey();
            int quantity = entry.getValue();

            TraderProducts product = traderProductsDAO.getTraderProductById(traderProductId);
            if (product == null) continue;

            result.add(Map.of(
                    "productId", traderProductId,
                    "productName", product.getProductName(),
                    "quantity", quantity
            ));
        }
        return result;
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