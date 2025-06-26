package com.spring.service;

import com.spring.dto.InventoryLogsDTO;
import java.util.List;

public interface InventoryLogsService {
    List<InventoryLogsDTO> getLogsByProductId(int productId);
    List<InventoryLogsDTO> getAllLogs();

    InventoryLogsDTO createOrder(InventoryLogsDTO orderDTO);
    InventoryLogsDTO confirmOrder(InventoryLogsDTO orderDTO);

}