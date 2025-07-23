package com.spring.service.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dao.ProductDAO;
import com.spring.dto.ExporterDTO;
import com.spring.entity.Exporter;
import com.spring.entity.ExporterDetail;
import com.spring.entity.Products;
import com.spring.service.ExporterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExporterServiceImpl implements ExporterService {

    private static final Logger logger = LoggerFactory.getLogger(ExporterServiceImpl.class);

    @Autowired
    private ExporterDAO exporterDAO;

    @Autowired
    private ProductDAO productDAO;

    @Override
    @Transactional
    public ExporterDTO getExporterById(Long id) {
        try {
            logger.info("Fetching exporter with ID: {}", id);
            Exporter exporter = exporterDAO.getExporterById(id);
            return convertToDTO(exporter);
        } catch (Exception e) {
            logger.error("Error fetching exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public List<ExporterDTO> getAllExporters() {
        try {
            logger.info("Fetching all exporters");
            return exporterDAO.getAllExporters().stream()
                    .map(this::convertToDTO)
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all exporters: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public List<ExporterDTO> searchExporters(String keyword) {
        try {
            logger.info("Searching exporters with keyword: {}", keyword);
            return exporterDAO.searchExporters(keyword).stream()
                    .map(this::convertToDTO)
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error searching exporters: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public ExporterDTO createExporter(ExporterDTO dto) {
        try {
            logger.info("Creating exporter for userId: {}", dto.getUserId());
            if (dto.getUserId() == null || dto.getItems() == null || dto.getItems().isEmpty()) {
                throw new IllegalArgumentException("UserID and items are required");
            }
            for (ExporterDTO.ExporterDetailDTO detailDTO : dto.getItems()) {
                if (!exporterDAO.checkStockAvailability(detailDTO.getProductId(), detailDTO.getQuantity())) {
                    throw new IllegalArgumentException("Insufficient stock for product ID: " + detailDTO.getProductId());
                }
            }
            Exporter exporter = convertToEntity(dto);
            exporter.setOrderDate(LocalDateTime.now());
            exporter.setStatus(1);
            Exporter created = exporterDAO.createExporter(exporter);
            exporterDAO.logExporterAction(created.getExporterId(), "Create", dto.getUserId(), "Created exporter request");

            for (ExporterDTO.ExporterDetailDTO detailDTO : dto.getItems()) {
                if (detailDTO.getProductId() == null || detailDTO.getQuantity() <= 0) {
                    throw new IllegalArgumentException("Invalid ExporterDetail: productId or quantity missing");
                }
                ExporterDetail detail = new ExporterDetail();
                detail.setExporterId(created.getExporterId());
                detail.setProductId(detailDTO.getProductId());
                detail.setQuantity(detailDTO.getQuantity());
                detail.setUnitPrice(detailDTO.getUnitPrice());
                detail.setImageUrl(detailDTO.getImageUrl());
                detail.setStatus(detailDTO.getStatus() != null ? detailDTO.getStatus() : 1);
                exporterDAO.createExporterDetail(detail);
            }
            return convertToDTO(created);
        } catch (Exception e) {
            logger.error("Failed to create exporter: {}", e.getMessage());
            throw new RuntimeException("Failed to create exporter: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public ExporterDTO updateExporter(Long id, ExporterDTO dto) {
        try {
            logger.info("Updating exporter with ID: {}", id);
            Exporter existing = exporterDAO.getExporterById(id);
            if (dto.getUserId() == null || dto.getItems() == null || dto.getItems().isEmpty()) {
                throw new IllegalArgumentException("UserID and items are required");
            }
            for (ExporterDTO.ExporterDetailDTO detailDTO : dto.getItems()) {
                if (!exporterDAO.checkStockAvailability(detailDTO.getProductId(), detailDTO.getQuantity())) {
                    throw new IllegalArgumentException("Insufficient stock for product ID: " + detailDTO.getProductId());
                }
            }
            Exporter updated = convertToEntity(dto);
            updated.setExporterId(id);
            updated.setOrderDate(existing.getOrderDate());
            updated.setStatus(existing.getStatus());

            exporterDAO.logExporterAction(id, "Update", dto.getUserId(), "Updated exporter details");
            exporterDAO.deleteExporterDetailsByExporterId(id);
            for (ExporterDTO.ExporterDetailDTO detailDTO : dto.getItems()) {
                if (detailDTO.getProductId() == null || detailDTO.getQuantity() <= 0) {
                    throw new IllegalArgumentException("Invalid ExporterDetail: productId or quantity missing");
                }
                ExporterDetail detail = new ExporterDetail();
                detail.setExporterId(id);
                detail.setProductId(detailDTO.getProductId());
                detail.setQuantity(detailDTO.getQuantity());
                detail.setUnitPrice(detailDTO.getUnitPrice());
                detail.setImageUrl(detailDTO.getImageUrl());
                detail.setStatus(detailDTO.getStatus() != null ? detailDTO.getStatus() : 1);
                exporterDAO.createExporterDetail(detail);
            }
            return convertToDTO(exporterDAO.updateExporter(updated));
        } catch (Exception e) {
            logger.error("Failed to update exporter ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update exporter: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void updateStatus(Long id, Integer statusId) {
        try {
            logger.info("Updating status for exporter ID: {}", id);
            exporterDAO.updateStatus(id, statusId);
            exporterDAO.logExporterAction(id, "UpdateStatus", null, "Updated status to: " + statusId);
        } catch (Exception e) {
            logger.error("Failed to update status for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void confirmOrder(Long id) {
        try {
            logger.info("Confirming order for exporter ID: {}", id);
            exporterDAO.confirmOrder(id);
            exporterDAO.logExporterAction(id, "ConfirmOrder", null, "Order confirmed");
        } catch (Exception e) {
            logger.error("Failed to confirm order for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void rejectOrder(Long id, String reason) {
        try {
            logger.info("Rejecting order for exporter ID: {}", id);
            exporterDAO.rejectOrder(id, reason);
            exporterDAO.logExporterAction(id, "RejectOrder", null, "Order rejected: " + reason);
        } catch (Exception e) {
            logger.error("Failed to reject order for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void returnOrder(Long id, String returnReason) {
        try {
            logger.info("Returning order for exporter ID: {}", id);
            exporterDAO.returnOrder(id, returnReason);
            exporterDAO.logExporterAction(id, "ReturnOrder", null, "Order returned: " + returnReason);
        } catch (Exception e) {
            logger.error("Failed to return order for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void updateStock(Long exporterId, Long productId, Integer quantity, String action) {
        try {
            logger.info("Updating stock for exporter ID: {}, productId: {}", exporterId, productId);
            exporterDAO.updateStock(exporterId, productId, quantity, action);
            exporterDAO.logExporterAction(exporterId, "UpdateStock", null, "Stock updated: productId=" + productId + ", action=" + action);
        } catch (Exception e) {
            logger.error("Failed to update stock for exporter ID {}: {}", exporterId, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void confirmDelivery(Long id) {
        try {
            logger.info("Confirming delivery for exporter ID: {}", id);
            exporterDAO.confirmDelivery(id);
            exporterDAO.logExporterAction(id, "ConfirmDelivery", null, "Delivery confirmed");
        } catch (Exception e) {
            logger.error("Failed to confirm delivery for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void driverConfirmDelivery(Long id) {
        try {
            logger.info("Driver confirming delivery for exporter ID: {}", id);
            exporterDAO.driverConfirmDelivery(id);
            exporterDAO.logExporterAction(id, "DriverConfirmDelivery", null, "Driver confirmed delivery");
        } catch (Exception e) {
            logger.error("Failed to driver confirm delivery for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void updateDeliverySchedule(Long id, String estimatedDeliveryDate) {
        try {
            logger.info("Updating delivery schedule for exporter ID: {}", id);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
            LocalDateTime.parse(estimatedDeliveryDate, formatter); // Validate format
            exporterDAO.updateDeliverySchedule(id, estimatedDeliveryDate);
            exporterDAO.logExporterAction(id, "UpdateDeliverySchedule", null, "Updated delivery schedule: " + estimatedDeliveryDate);
        } catch (DateTimeParseException e) {
            logger.error("Invalid date format for exporter ID {}: {}", id, e.getMessage());
            throw new IllegalArgumentException("Invalid date format: " + estimatedDeliveryDate + ". Expected: yyyy-MM-dd'T'HH:mm:ss", e);
        } catch (Exception e) {
            logger.error("Failed to update delivery schedule for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void prepareShipment(Long id, Long exporterId, Long productId, Integer quantity) {
        try {
            logger.info("Preparing shipment for exporter ID: {}, productId: {}", id, productId);
            exporterDAO.prepareShipment(id, exporterId, productId, quantity);
            exporterDAO.logExporterAction(exporterId, "PrepareShipment", null, "Shipment prepared: productId=" + productId + ", quantity=" + quantity);
        } catch (Exception e) {
            logger.error("Failed to prepare shipment for exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public boolean checkStockAvailability(Long productId, Integer quantity) {
        try {
            logger.info("Checking stock for productId: {}, quantity: {}", productId, quantity);
            return exporterDAO.checkStockAvailability(productId, quantity);
        } catch (Exception e) {
            logger.error("Failed to check stock for productId {}: {}", productId, e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteExporter(Long id, String cancelReason) {
        try {
            logger.info("Deleting exporter ID: {}", id);
            if (cancelReason == null || cancelReason.trim().isEmpty()) {
                throw new IllegalArgumentException("Cancel reason cannot be empty");
            }
            exporterDAO.deleteExporterDetailsByExporterId(id);
            exporterDAO.deleteExporter(id);
            exporterDAO.logExporterAction(id, "DeleteExporter", null, "Exporter deleted: " + cancelReason);
        } catch (Exception e) {
            logger.error("Failed to delete exporter ID {}: {}", id, e.getMessage());
            throw e;
        }
    }

    private ExporterDTO convertToDTO(Exporter exporter) {
        try {
            List<ExporterDTO.ExporterDetailDTO> items = exporter.getItems() != null ?
                    exporter.getItems().stream()
                            .map(item -> {
                                Products product = productDAO.getProductById(item.getProductId().intValue());
                                return new ExporterDTO.ExporterDetailDTO(
                                        item.getExporterDetailId(),
                                        item.getExporterId(),
                                        item.getProductId(),
                                        item.getQuantity(),
                                        item.getUnitPrice(),
                                        product != null ? product.getImageURL() : item.getImageUrl(),
                                        item.getStatus()
                                );
                            })
                            .collect(Collectors.toList()) : List.of();

            return new ExporterDTO(
                    exporter.getExporterId(),
                    exporter.getUserId(),
                    exporter.getCustomerId(),
                    exporter.getCustomerName(),
                    exporter.getPhone(),
                    exporter.getEmail(),
                    exporter.getShippingAddress(),
                    exporter.getDriverId(),
                    exporter.getOrderDate(),
                    exporter.getEstimatedDeliveryDate(),
                    exporter.getDelayReason(),
                    exporter.getStatusId(),
                    exporter.getCancelReason(),
                    exporter.getReturnReason(),
                    exporter.getSource(),
                    exporter.getStatus(),
                    items
            );
        } catch (Exception e) {
            logger.error("Error converting exporter ID {}: {}", exporter.getExporterId(), e.getMessage());
            return null;
        }
    }

    private Exporter convertToEntity(ExporterDTO dto) {
        Exporter exporter = new Exporter();
        exporter.setUserId(dto.getUserId());
        exporter.setCustomerId(dto.getCustomerId());
        exporter.setCustomerName(dto.getCustomerName());
        exporter.setPhone(dto.getPhone());
        exporter.setEmail(dto.getEmail());
        exporter.setShippingAddress(dto.getShippingAddress());
        exporter.setDriverId(dto.getDriverId());
        exporter.setEstimatedDeliveryDate(dto.getEstimatedDeliveryDate());
        exporter.setDelayReason(dto.getDelayReason());
        exporter.setStatusId(dto.getStatusId());
        exporter.setCancelReason(dto.getCancelReason());
        exporter.setReturnReason(dto.getReturnReason());
        exporter.setSource(dto.getSource());
        exporter.setStatus(dto.getStatus());
        return exporter;
    }
}