package com.spring.dao;

import com.spring.entity.Exporter;
import com.spring.entity.ExporterDetail;

import java.util.List;

public interface ExporterDAO {
    Exporter getExporterById(Long id);
    List<Exporter> getAllExporters();
    List<Exporter> searchExporters(String keyword);
    Exporter createExporter(Exporter exporter);
    Exporter updateExporter(Exporter exporter);
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
    void deleteExporter(Long id);
    void createExporterDetail(ExporterDetail detail);
    void deleteExporterDetailsByExporterId(Long exporterId);
    void logExporterAction(Long exporterId, String action, Long userId, String details);
}