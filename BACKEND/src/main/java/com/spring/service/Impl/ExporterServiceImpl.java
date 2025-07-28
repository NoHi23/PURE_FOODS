package com.spring.service.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderDetailDTO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.service.ExporterService;
import com.spring.service.OrderStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExporterServiceImpl implements ExporterService {

    private static final Logger logger = LoggerFactory.getLogger(ExporterServiceImpl.class);

    @Autowired
    private ExporterDAO exporterDAO;

    @Autowired
    private OrderStatusService orderStatusService;

    @Override
    public List<ExporterDTO> getAllExportRequests() {
        logger.info("Fetching all export requests");
        List<ExporterDTO> exportRequests = exporterDAO.getAllExportRequests();
        // Điền statusName cho mỗi ExporterDTO
        for (ExporterDTO exporterDTO : exportRequests) {
            if (exporterDTO.getStatusID() != null) {
                try {
                    exporterDTO.setStatusName(orderStatusService.findById(exporterDTO.getStatusID()).getStatusName());
                } catch (Exception e) {
                    logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                    exporterDTO.setStatusName("Unknown");
                }
            }
        }
        logger.info("Fetched {} export requests", exportRequests.size());
        return exportRequests;
    }

    @Override
    public ExporterDTO getExportRequestById(int orderId) {
        logger.info("Fetching export request for order ID: {}", orderId);
        ExporterDTO exporterDTO = exporterDAO.getExportRequestById(orderId);
        if (exporterDTO != null && exporterDTO.getStatusID() != null) {
            try {
                exporterDTO.setStatusName(orderStatusService.findById(exporterDTO.getStatusID()).getStatusName());
            } catch (Exception e) {
                logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                exporterDTO.setStatusName("Unknown");
            }
        }
        if (exporterDTO == null) {
            logger.warn("No export request found for order ID: {}", orderId);
        }
        return exporterDTO;
    }

    @Override
    @Transactional
    public void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails) {
        logger.info("Creating export request for order ID: {}", exporterDTO.getOrderID());
        if (exporterDTO.getOrderID() == null) {
            logger.error("Order ID is null");
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        if (orderDetails == null || orderDetails.isEmpty()) {
            logger.error("Order details list is null or empty for order ID: {}", exporterDTO.getOrderID());
            throw new IllegalArgumentException("Order details cannot be null or empty");
        }

        // Validate statusID
        if (exporterDTO.getStatusID() != null && !List.of(1, 2, 3, 4, 5).contains(exporterDTO.getStatusID())) {
            logger.error("Invalid statusID: {} for order ID: {}", exporterDTO.getStatusID(), exporterDTO.getOrderID());
            throw new IllegalArgumentException("statusID không hợp lệ! Chỉ chấp nhận các giá trị: 1, 2, 3, 4, 5");
        }

        // Điền statusName nếu statusID có giá trị
        if (exporterDTO.getStatusID() != null) {
            try {
                exporterDTO.setStatusName(orderStatusService.findById(exporterDTO.getStatusID()).getStatusName());
            } catch (Exception e) {
                logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                exporterDTO.setStatusName("Unknown");
            }
        }

        // Kiểm tra tính hợp lệ của các trường số
        try {
            if (exporterDTO.getCustomerID() != null && String.valueOf(exporterDTO.getCustomerID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid customerID: " + exporterDTO.getCustomerID());
            }
            if (exporterDTO.getShippingMethodID() != null && String.valueOf(exporterDTO.getShippingMethodID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid shippingMethodID: " + exporterDTO.getShippingMethodID());
            }
            if (exporterDTO.getDriverID() != null && String.valueOf(exporterDTO.getDriverID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid driverID: " + exporterDTO.getDriverID());
            }
        } catch (NumberFormatException e) {
            logger.error("Invalid integer value in ExporterDTO: {}", e.getMessage());
            throw new IllegalArgumentException("Dữ liệu không hợp lệ cho các trường số: " + e.getMessage());
        }

        // Gọi DAO để tạo yêu cầu xuất hàng
        exporterDAO.createExportRequest(exporterDTO, orderDetails);
        logger.info("Successfully created export request for order ID: {}", exporterDTO.getOrderID());
    }

    @Override
    @Transactional
    public void cancelExportRequest(int orderId, String cancelReason, int exporterId) {
        logger.info("Canceling export request for order ID: {} by exporter ID: {}", orderId, exporterId);
        if (cancelReason == null || cancelReason.trim().isEmpty()) {
            logger.error("Cancel reason is null or empty for order ID: {}", orderId);
            throw new IllegalArgumentException("Cancel reason cannot be null or empty");
        }
        exporterDAO.cancelExportRequest(orderId, cancelReason, exporterId);
        logger.info("Successfully canceled export request for order ID: {}", orderId);
    }

    @Override
    public boolean checkInventoryAvailability(int productId, int quantity) {
        logger.info("Checking inventory availability for product ID: {} with quantity: {}", productId, quantity);
        boolean available = exporterDAO.checkInventoryAvailability(productId, quantity);
        logger.info("Inventory check result for product ID {}: {}", productId, available);
        return available;
    }

    @Override
    @Transactional
    public void confirmOrder(int orderId, int exporterId) {
        logger.info("Confirming order ID: {} by exporter ID: {}", orderId, exporterId);
        exporterDAO.confirmOrder(orderId, exporterId);
        logger.info("Successfully confirmed order ID: {}", orderId);
    }

    @Override
    @Transactional
    public void rejectOrder(int orderId, String rejectReason, int exporterId) {
        logger.info("Rejecting order ID: {} by exporter ID: {}", orderId, exporterId);
        if (rejectReason == null || rejectReason.trim().isEmpty()) {
            logger.error("Reject reason is null or empty for order ID: {}", orderId);
            throw new IllegalArgumentException("Reject reason cannot be null or empty");
        }
        exporterDAO.rejectOrder(orderId, rejectReason, exporterId);
        logger.info("Successfully rejected order ID: {}", orderId);
    }

    @Override
    public List<InventoryLogsDTO> getExportHistory(int productId, int orderId) {
        logger.info("Fetching export history for product ID: {} and order ID: {}", productId, orderId);
        List<InventoryLogsDTO> history = exporterDAO.getExportHistory(productId, orderId);
        logger.info("Fetched {} inventory logs", history.size());
        return history;
    }
}