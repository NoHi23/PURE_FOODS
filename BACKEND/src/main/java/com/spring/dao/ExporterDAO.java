package com.spring.dao;

import com.spring.dto.*;

import java.util.List;
import java.util.Map;

public interface ExporterDAO {
    List<ExporterDTO> getAllExportRequests();
    ExporterDTO getExportRequestById(int orderId);
    void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails);
    void cancelExportRequest(int orderId, String cancelReason, int exporterId);
    void requestCancelOrder(int orderId, String cancelReason, int customerId);
    void updateOrderStatus(int orderId, int newStatusId, int exporterId);
    List<ExporterDTO> getExportHistory(Integer statusId, String startDate, String endDate, String filterType);
    List<NotificationDTO> getNotificationsByUserId(int userId);
    boolean checkInventoryAvailability(int productId, int quantity);
    List<ExporterDTO> trackExportOrders(Integer statusId, String startDate, String endDate);
    ExporterDTO getOrderTrackingDetails(int orderId);
    Map<String, Integer> getExportStats();
    List<ProductDTO> getInventoryProducts();
}