// Giữ nguyên phần package, import, annotation @Service, @Transactional
package com.spring.service.Impl;

import com.spring.dao.InventoryLogsDAO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.entity.InventoryLogs;
import com.spring.service.InventoryLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

// Bắt đầu thay đổi phương thức recordImport
@Service
@Transactional(propagation = Propagation.REQUIRED)
public class InventoryLogsServiceImpl implements InventoryLogsService {

    @Autowired
    private InventoryLogsDAO inventoryLogsDAO;

    @Override
    public InventoryLogsDTO recordImport(InventoryLogsDTO inventoryLogsDTO) {
        InventoryLogs log = new InventoryLogs();
        log.setProductId(inventoryLogsDTO.getProductId());
        log.setUserId(inventoryLogsDTO.getUserId()); // Giả sử UserID của Importer
        log.setQuantityChange(inventoryLogsDTO.getQuantityChange());
        log.setReason(inventoryLogsDTO.getReason());
        log.setCreatedAt(new java.util.Date());
        log.setStatus(inventoryLogsDTO.getStatus());
        inventoryLogsDAO.addInventoryLog(log);

        // Lấy lại log từ database để lấy logId và createdAt chính xác
        InventoryLogs savedLog = inventoryLogsDAO.getLatestLog(); // Giả sử có phương thức này
        InventoryLogsDTO resultDTO = convertToDTO(savedLog);
        return resultDTO;
    }

    // Giữ nguyên các phương thức khác
    @Override
    public List<InventoryLogsDTO> getLogsByProductId(int productId) {
        List<InventoryLogs> logs = inventoryLogsDAO.getLogsByProductId(productId);
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
}