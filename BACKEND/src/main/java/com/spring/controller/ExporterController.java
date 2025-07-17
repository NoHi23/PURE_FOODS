package com.spring.controller;

import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderDTO;
import com.spring.dto.TraderTransactionDTO;
import com.spring.entity.Exporter;
import com.spring.entity.Order;
import com.spring.service.ExporterService;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/exporter")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExporterController {

    @Autowired
    private ExporterService exporterService;
    @Autowired
    private OrderService orderService;

    @GetMapping("/{id}")
    public ResponseEntity<ExporterDTO> getExporterById(@PathVariable("id") int id) {
        try {
            ExporterDTO exporterDTO = exporterService.getExporterById(id);
            if (exporterDTO == null) {
                return ResponseEntity.ok(new ExporterDTO(0, "", "", null, "", "", null, null));
            }
            return ResponseEntity.ok(exporterDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ExporterDTO(0, "", e.getMessage(), null, "", "", null, null));
        }
    }

    @PostMapping("/order")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO createdOrder = orderService.createOrder(orderDTO);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            OrderDTO errorOrder = new OrderDTO();
            return ResponseEntity.badRequest().body(errorOrder);
        }
    }

    @GetMapping("/orders/{exporterId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByExporterId(@PathVariable("exporterId") int exporterId,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size) {
        try {
            // Giả sử exporterId là customerId trong Order
            List<OrderDTO> orders = orderService.getOrdersByCustomerId(exporterId);
            return ResponseEntity.ok(orders.stream().skip(page * size).limit(size).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/inventory")
    public ResponseEntity<Void> manageInventory(
            @RequestParam int exporterId,
            @RequestParam int productId,
            @RequestParam int quantity,
            @RequestParam String action) {
        try {
            // Logic quản lý inventory (cần implement trong service/DAO nếu cần)
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/export-from-inventory")
    public ResponseEntity<Void> exportFromInventory(
            @RequestParam int exporterId,
            @RequestParam int orderId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        try {
            // Logic xuất kho (cần implement trong service/DAO)
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/transactions/{exporterId}")
    public ResponseEntity<List<TraderTransactionDTO>> getTransactions(@PathVariable("exporterId") int exporterId,
                                                                      @RequestParam(defaultValue = "0") int page,
                                                                      @RequestParam(defaultValue = "10") int size) {
        try {
            List<TraderTransactionDTO> transactions = exporterService.getTransactions(exporterId, page, size);
            return ResponseEntity.ok(transactions != null ? transactions : List.of());
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<ExporterDTO> updateProfile(@PathVariable("id") int id, @RequestBody ExporterDTO exporterDTO) {
        try {
            ExporterDTO updatedExporter = exporterService.updateProfile(id, exporterDTO);
            if (updatedExporter == null) {
                return ResponseEntity.ok(new ExporterDTO(0, "", "", null, "", "", null, null));
            }
            return ResponseEntity.ok(updatedExporter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ExporterDTO(0, "", e.getMessage(), null, "", "", null, null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<OrderDTO>> searchOrders(@RequestParam String keyword,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        try {
            List<OrderDTO> orders = orderService.getAllOrders().stream()
                    .filter(o -> o.getShippingAddress() != null && o.getShippingAddress().contains(keyword))
                    .skip(page * size).limit(size)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("orderId") int orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Server error: " + e.getMessage());
    }
}