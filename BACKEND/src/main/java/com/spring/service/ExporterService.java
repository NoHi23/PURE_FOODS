package com.spring.service;

import com.spring.dto.*;
import com.spring.entity.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ExporterService {
    List<ExporterDTO> getAllExportRequests();
    ExporterDTO getExportRequestById(int orderId);
    void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails, int exporterId);
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