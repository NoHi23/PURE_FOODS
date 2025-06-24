package com.spring.service;

import com.spring.dto.InventoryLogsDTO;
import java.util.List;

public interface InventoryLogsService {
    InventoryLogsDTO recordImport(InventoryLogsDTO inventoryLogsDTO);
    List<InventoryLogsDTO> getLogsByProductId(int productId);
}