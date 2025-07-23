package com.spring.service;

import com.spring.dto.ExporterDTO;
import java.util.List;

public interface ExporterService {
    ExporterDTO getExporterById(Long id);
    List<ExporterDTO> getAllExporters();
    List<ExporterDTO> searchExporters(String keyword);
    ExporterDTO createExporter(ExporterDTO dto);
    ExporterDTO updateExporter(Long id, ExporterDTO dto);
    void updateStatus(Long id, Integer statusId);
    void confirmOrder(Long id);
    void rejectOrder(Long id, String reason);
    void returnOrder(Long id, String returnReason);
    void updateStock(Long exporterId, Long productId, Integer quantity, String action);
    void confirmDelivery(Long id);
    void driverConfirmDelivery(Long id);
    void updateDeliverySchedule(Long id, String estimatedDeliveryDate);
    void prepareShipment(Long id, Long exporterId, Long productId, Integer quantity);
    boolean checkStockAvailability(Long productId, Integer quantity);
    void deleteExporter(Long id, String cancelReason);
}