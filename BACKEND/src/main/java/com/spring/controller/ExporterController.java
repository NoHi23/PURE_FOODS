package com.spring.controller;

import com.spring.dto.ExporterDTO;
import com.spring.service.ExporterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/exporters")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExporterController {

    private static final Logger logger = LoggerFactory.getLogger(ExporterController.class);

    @Autowired
    private ExporterService exporterService;

    @GetMapping
    public ResponseEntity<List<ExporterDTO>> getAllExporters() {
        try {
            logger.info("Fetching all exporters");
            List<ExporterDTO> exporters = exporterService.getAllExporters();
            return ResponseEntity.ok(exporters);
        } catch (Exception e) {
            logger.error("Error fetching all exporters: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExporterDTO> getExporterById(@PathVariable("id") Long id) {
        try {
            logger.info("Fetching exporter with ID: {}", id);
            ExporterDTO dto = exporterService.getExporterById(id);
            if (dto == null) {
                logger.warn("Exporter not found with ID: {}", id);
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            logger.error("Error fetching exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ExporterDTO>> searchExporters(@RequestParam(value = "keyword", required = false) String keyword) {
        try {
            logger.info("Searching exporters with keyword: {}", keyword);
            if (keyword == null || keyword.trim().isEmpty()) {
                return ResponseEntity.ok(exporterService.getAllExporters());
            }
            return ResponseEntity.ok(exporterService.searchExporters(keyword));
        } catch (Exception e) {
            logger.error("Error searching exporters: {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> createExporter(@RequestBody ExporterDTO dto) {
        try {
            logger.info("Creating new exporter for userId: {}", dto != null ? dto.getUserId() : null);
            // Manual validation
            if (dto == null || dto.getUserId() == null || dto.getItems() == null || dto.getItems().isEmpty()) {
                logger.error("Invalid request: userId and items list are required");
                return ResponseEntity.status(400).body("Invalid request: userId and items list are required");
            }
            for (ExporterDTO.ExporterDetailDTO item : dto.getItems()) {
                if (item.getProductId() == null || item.getQuantity() <= 0) {
                    logger.error("Invalid item: productId and quantity are required");
                    return ResponseEntity.status(400).body("Invalid item: productId and quantity are required");
                }
            }
            ExporterDTO created = exporterService.createExporter(dto);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for creating exporter: {}", e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to create exporter: {}", e.getMessage());
            return ResponseEntity.status(500).body("Failed to create exporter: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExporter(@PathVariable("id") Long id, @RequestBody ExporterDTO dto) {
        try {
            logger.info("Updating exporter with ID: {}", id);
            // Manual validation
            if (dto == null || dto.getUserId() == null || dto.getItems() == null || dto.getItems().isEmpty()) {
                logger.error("Invalid request: userId and items list are required");
                return ResponseEntity.status(400).body("Invalid request: userId and items list are required");
            }
            for (ExporterDTO.ExporterDetailDTO item : dto.getItems()) {
                if (item.getProductId() == null || item.getQuantity() <= 0) {
                    logger.error("Invalid item: productId and quantity are required");
                    return ResponseEntity.status(400).body("Invalid item: productId and quantity are required");
                }
            }
            ExporterDTO updated = exporterService.updateExporter(id, dto);
            if (updated == null) {
                logger.warn("Exporter not found with ID: {}", id);
                return ResponseEntity.status(404).body("Exporter not found");
            }
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for updating exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to update exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<String> updateStatus(@PathVariable("id") Long id, @RequestParam("statusId") Integer statusId) {
        try {
            logger.info("Updating status for exporter ID: {}", id);
            if (statusId == null || statusId < 1 || statusId > 5) {
                logger.error("Invalid statusId: {}", statusId);
                return ResponseEntity.status(400).body("Invalid statusId");
            }
            exporterService.updateStatus(id, statusId);
            return ResponseEntity.ok("Status updated successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid statusId for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to update status for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PutMapping("/confirmOrder/{id}")
    public ResponseEntity<String> confirmOrder(@PathVariable("id") Long id) {
        try {
            logger.info("Confirming order for exporter ID: {}", id);
            exporterService.confirmOrder(id);
            return ResponseEntity.ok("Order confirmed successfully");
        } catch (RuntimeException e) {
            logger.error("Failed to confirm order for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PutMapping("/rejectOrder/{id}")
    public ResponseEntity<String> rejectOrder(@PathVariable("id") Long id, @RequestParam("reason") String reason) {
        try {
            logger.info("Rejecting order for exporter ID: {}", id);
            if (reason == null || reason.trim().isEmpty()) {
                logger.error("Reject reason cannot be empty");
                return ResponseEntity.status(400).body("Reject reason cannot be empty");
            }
            exporterService.rejectOrder(id, reason);
            return ResponseEntity.ok("Order rejected successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid reason for rejecting exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to reject order for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<String> returnOrder(@PathVariable("id") Long id, @RequestParam("returnReason") String returnReason) {
        try {
            logger.info("Returning order for exporter ID: {}", id);
            if (returnReason == null || returnReason.trim().isEmpty()) {
                logger.error("Return reason cannot be empty");
                return ResponseEntity.status(400).body("Return reason cannot be empty");
            }
            exporterService.returnOrder(id, returnReason);
            return ResponseEntity.ok("Return order processed successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid return reason for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to return order for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PutMapping("/updateStock/{exporterId}")
    public ResponseEntity<String> updateStock(@PathVariable("exporterId") Long exporterId,
                                              @RequestParam("productId") Long productId,
                                              @RequestParam("quantity") Integer quantity,
                                              @RequestParam("action") String action) {
        try {
            logger.info("Updating stock for exporter ID: {}, productId: {}", exporterId, productId);
            if (quantity < 0) {
                logger.error("Quantity cannot be negative");
                return ResponseEntity.status(400).body("Quantity cannot be negative");
            }
            if (!"update".equalsIgnoreCase(action) && !"delete".equalsIgnoreCase(action)) {
                logger.error("Invalid action: {}", action);
                return ResponseEntity.status(400).body("Invalid action");
            }
            exporterService.updateStock(exporterId, productId, quantity, action);
            return ResponseEntity.ok("Stock updated successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for updating stock for exporter ID {}: {}", exporterId, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to update stock for exporter ID {}: {}", exporterId, e.getMessage());
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/confirmDelivery/{id}")
    public ResponseEntity<String> confirmDelivery(@PathVariable("id") Long id) {
        try {
            logger.info("Confirming delivery for exporter ID: {}", id);
            exporterService.confirmDelivery(id);
            return ResponseEntity.ok("Delivery confirmed successfully");
        } catch (RuntimeException e) {
            logger.error("Failed to confirm delivery for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PutMapping("/driverConfirm/{id}")
    public ResponseEntity<String> driverConfirmDelivery(@PathVariable("id") Long id) {
        try {
            logger.info("Driver confirming delivery for exporter ID: {}", id);
            exporterService.driverConfirmDelivery(id);
            return ResponseEntity.ok("Driver confirmed delivery successfully");
        } catch (RuntimeException e) {
            logger.error("Failed to driver confirm delivery for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }

    @PostMapping("/prepareShipment/{id}")
    public ResponseEntity<String> prepareShipment(@PathVariable("id") Long id,
                                                  @RequestParam("exporterId") Long exporterId,
                                                  @RequestParam("productId") Long productId,
                                                  @RequestParam("quantity") Integer quantity) {
        try {
            logger.info("Preparing shipment for exporter ID: {}, productId: {}", id, productId);
            if (quantity <= 0) {
                logger.error("Quantity must be greater than 0");
                return ResponseEntity.status(400).body("Quantity must be greater than 0");
            }
            exporterService.prepareShipment(id, exporterId, productId, quantity);
            return ResponseEntity.ok("Shipment prepared successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for preparing shipment for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to prepare shipment for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/checkStock/{productId}")
    public ResponseEntity<ExporterDTO.StockAvailability> checkStockAvailability(@PathVariable("productId") Long productId, @RequestParam("quantity") Integer quantity) {
        try {
            logger.info("Checking stock for productId: {}, quantity: {}", productId, quantity);
            if (quantity <= 0) {
                logger.error("Quantity must be greater than 0");
                return ResponseEntity.status(400).body(new ExporterDTO.StockAvailability(false));
            }
            boolean available = exporterService.checkStockAvailability(productId, quantity);
            return ResponseEntity.ok(new ExporterDTO.StockAvailability(available));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for checking stock for productId {}: {}", productId, e.getMessage());
            return ResponseEntity.status(400).body(new ExporterDTO.StockAvailability(false));
        } catch (RuntimeException e) {
            logger.error("Failed to check stock for productId {}: {}", productId, e.getMessage());
            return ResponseEntity.status(400).body(new ExporterDTO.StockAvailability(false));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExporter(@PathVariable("id") Long id, @RequestParam("cancelReason") String cancelReason) {
        try {
            logger.info("Deleting exporter ID: {}", id);
            if (cancelReason == null || cancelReason.trim().isEmpty()) {
                logger.error("Cancel reason cannot be empty");
                return ResponseEntity.status(400).body("Cancel reason cannot be empty");
            }
            exporterService.deleteExporter(id, cancelReason);
            return ResponseEntity.ok("Exporter deleted successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid cancel reason for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to delete exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body("Exporter not found: " + e.getMessage());
        }
    }
    @PutMapping("/updateDelivery/{id}")
    public ResponseEntity<String> updateDeliverySchedule(@PathVariable("id") Long id, @RequestParam("estimatedDeliveryDate") String estimatedDeliveryDate) {
        try {
            logger.info("Updating delivery schedule for exporter ID: {}", id);
            if (estimatedDeliveryDate == null || estimatedDeliveryDate.trim().isEmpty()) {
                logger.error("Estimated delivery date cannot be empty");
                return ResponseEntity.status(400).body("Estimated delivery date cannot be empty");
            }
            // Kiểm tra định dạng ngày giờ (ISO 8601: yyyy-MM-dd'T'HH:mm:ss)
            try {
                LocalDateTime.parse(estimatedDeliveryDate, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
            } catch (DateTimeParseException e) {
                logger.error("Invalid date format for estimatedDeliveryDate: {}", estimatedDeliveryDate);
                return ResponseEntity.status(400).body("Invalid date format. Use yyyy-MM-dd'T'HH:mm:ss (e.g., 2025-07-25T10:00:00)");
            }
            exporterService.updateDeliverySchedule(id, estimatedDeliveryDate);
            return ResponseEntity.ok("Delivery schedule updated successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid input for updating delivery schedule for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Failed to update delivery schedule for exporter ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

}