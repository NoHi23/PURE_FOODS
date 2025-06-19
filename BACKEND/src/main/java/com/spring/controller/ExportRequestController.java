package com.spring.controller;

import com.spring.entity.Orders;
import com.spring.entity.OrderDetails;
import com.spring.service.ExportRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// DTO để nhận dữ liệu từ client
import com.spring.dto.ExportRequestDTO;
import com.spring.dto.ExportRequestResponseDTO;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/export-requests")
public class ExportRequestController {

    @Autowired
    private ExportRequestService exportRequestService;

   @PostMapping
public ResponseEntity<ExportRequestResponseDTO> createExportRequest(@RequestBody ExportRequestDTO request) {
    Orders savedOrder = exportRequestService.createExportRequest(request.order, request.orderDetails);
    return ResponseEntity.ok(toDTO(savedOrder));
}

   @GetMapping
public ResponseEntity<List<ExportRequestResponseDTO>> getAllExportRequests(
        @RequestParam(value = "status", required = false) String status) {
    List<Orders> requests = exportRequestService.getAllExportRequests(status);
    List<ExportRequestResponseDTO> response = requests.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    return ResponseEntity.ok(response);
}

 @GetMapping("/{id}")
public ResponseEntity<ExportRequestResponseDTO> getExportRequestById(@PathVariable("id") Integer id) {
    Orders request = exportRequestService.getExportRequestById(id);
    if (request != null) {
        return ResponseEntity.ok(toDTO(request));
    } else {
        return ResponseEntity.notFound().build();
    }
}
    private ExportRequestResponseDTO toDTO(Orders order) {
    ExportRequestResponseDTO dto = new ExportRequestResponseDTO();
    dto.id = order.getOrderId() != null ? "ORD" + String.format("%03d", order.getOrderId()) : null;
    dto.customerName = order.getCustomer() != null ? order.getCustomer().getFullName() : null;
    dto.amount = order.getTotalAmount();
    dto.date = order.getOrderDate() != null ? order.getOrderDate().toLocalDateTime().toLocalDate().toString() : null;
        dto.status = (order.getStatus() != null && order.getStatus().getStatusName() != null)
        ? order.getStatus().getStatusName().toLowerCase()
        : null;

    ExportRequestResponseDTO.CustomerDetails customerDetails = new ExportRequestResponseDTO.CustomerDetails();
    if (order.getCustomer() != null) {
        customerDetails.email = order.getCustomer().getEmail();
        customerDetails.phone = order.getCustomer().getPhone();
        customerDetails.address = order.getCustomer().getAddress();
    }
    dto.customerDetails = customerDetails;

    ExportRequestResponseDTO.Shipping shipping = new ExportRequestResponseDTO.Shipping();
    if (order.getShippingMethod() != null) {
        shipping.method = order.getShippingMethod().getMethodName();
    }
    shipping.estimatedDelivery = order.getEstimatedDeliveryDate() != null
            ? order.getEstimatedDeliveryDate().toLocalDateTime().toLocalDate().toString()
            : null;
    shipping.cost = order.getShippingCost();
    shipping.distance = order.getDistance() != null ? order.getDistance() + " km" : null;
    dto.shipping = shipping;

    ExportRequestResponseDTO.Driver driver = new ExportRequestResponseDTO.Driver();
    if (order.getDriver() != null) {
        driver.name = order.getDriver().getDriverName();
        driver.contact = order.getDriver().getPhone();
        driver.vehicle = order.getDriver().getVehicleInfo();
    }
    dto.driver = driver;
     dto.estimatedDeliveryDate = order.getEstimatedDeliveryDate() != null
            ? order.getEstimatedDeliveryDate().toLocalDateTime().toString()
            : null;
    return dto;
}
 @PutMapping("/{id}/cancel")
public ResponseEntity<ExportRequestResponseDTO> cancelExportRequest(
        @PathVariable("id") Integer id,
        @RequestParam("cancelReason") String cancelReason) {
    Orders updatedOrder = exportRequestService.cancelExportRequest(id, cancelReason);
    if (updatedOrder != null) {
        return ResponseEntity.ok(toDTO(updatedOrder));
    } else {
        return ResponseEntity.notFound().build();
    }
}

@PostMapping("/receive")
public ResponseEntity<ExportRequestResponseDTO> receiveExportRequest(@RequestBody Orders order) {
    Orders receivedOrder = exportRequestService.receiveExportRequest(order);
    return ResponseEntity.ok(toDTO(receivedOrder));
}
}