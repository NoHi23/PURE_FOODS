// Giữ nguyên phần package, import, annotation @Service, @Transactional
package com.spring.service.Impl;

import com.spring.dao.InventoryLogsDAO;
import com.spring.dao.ProductDAO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.entity.InventoryLogs;
import com.spring.entity.Products;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

// Bắt đầu thay đổi phương thức recordImport
@Service
@Transactional(propagation = Propagation.REQUIRED)
public class InventoryLogsServiceImpl implements InventoryLogsService {

    @Autowired
    private InventoryLogsDAO inventoryLogsDAO;

    @Autowired
    private ProductDAO productDAO;

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
        List<InventoryLogs> logs = inventoryLogsDAO.getAllLogs();
        List<InventoryLogsDTO> dtoList = new ArrayList<>();
        for (InventoryLogs log : logs) {
            dtoList.add(convertToDTO(log));
        }
        return dtoList;
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

    @Override
    public InventoryLogsDTO createReturnOrder(InventoryLogsDTO dto) {
        InventoryLogs log = new InventoryLogs();
        log.setProductId(dto.getProductId());
        log.setUserId(dto.getUserId());
        log.setQuantityChange(dto.getQuantityChange());
        log.setReason(dto.getReason());
        log.setCreatedAt(new Date());
        log.setStatus(5);
        inventoryLogsDAO.addInventoryLog(log);
        return convertToDTO(inventoryLogsDAO.getLatestLog());
    }

    @Override
    public InventoryLogsDTO archiveLog(int logId) {
        InventoryLogs log = inventoryLogsDAO.getLogById(logId);
        if (log == null) {
            throw new RuntimeException("Không tìm thấy log cần lưu trữ!");
        }
        log.setStatus(3); // đánh dấu là lưu trữ
        inventoryLogsDAO.updateInventoryLog(log);
        return convertToDTO(log);
    }

}