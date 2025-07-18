package com.spring.controller;

import com.spring.common.StripeService;
import com.spring.common.VnpayService;
import com.spring.dto.BestSellingProductDTO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO createdOrder = orderService.createOrder(orderDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order created successfully!");
            response.put("status", 200);
            response.put("order", createdOrder);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO confirmed = orderService.confirmOrder(orderDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order confirmed successfully!");
            response.put("status", 200);
            response.put("order", confirmed);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getOrdersByCustomer(@PathVariable("customerId") int customerId) {
        try {
            List<OrderDTO> orders = orderService.getOrdersByCustomerId(customerId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Orders retrieved successfully!");
            response.put("status", 200);
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable("orderId") int orderId) {
        try {
            OrderDTO order = orderService.getOrderById(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order retrieved successfully!");
            response.put("status", 200);
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "All orders retrieved successfully!");
            response.put("status", 200);
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable("orderId") int orderId) {
        try {
            orderService.deleteOrder(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order deleted successfully!");
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 201);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> countOrders() {
        try {
            int count = orderService.countOrder();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "get number of Order successfully!");
            response.put("status", 200);
            response.put("countOrder", count);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/revenue")
    public ResponseEntity<Double> getRevenue() {
        double revenue = orderService.calculateTotalRevenue();
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/monthly")
    public ResponseEntity<Map<Integer, Double>> getMonthlyRevenue() {
        Map<Integer, Double> revenue = orderService.calculateMonthlyRevenue();
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/top5-best-selling")
    public ResponseEntity<List<BestSellingProductDTO>> getTop5BestSellingProductsWithStats() {
        List<BestSellingProductDTO> list = orderService.getTop5BestSellingProductsWithStats();
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }
    @GetMapping("/top5-recent-orders")
    public ResponseEntity<List<Order>> getTop5RecentOrders() {
        List<Order> orders = orderService.getTop5RecentOrders();
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    @Autowired
    private VnpayService vnpayService;

    @Autowired
    private StripeService stripeService;

    @PostMapping("/createOrder")
    public ResponseEntity<?> createOrders(@RequestBody OrderDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        System.out.println("PaymentMethod: " + createdOrder.getPaymentMethod());

        String paymentMethod = Optional.ofNullable(createdOrder.getPaymentMethod())
                .orElse("COD")
                .toUpperCase();

        switch (paymentMethod) {
            case "VNPAY":
                try {
                    String vnpayUrl = vnpayService.createPaymentUrl(createdOrder);
                    return ResponseEntity.ok(Map.of("redirectUrl", vnpayUrl));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Lỗi khi tạo URL VNPAY: " + e.getMessage());
                }

            case "STRIPE":
                String stripeUrl = stripeService.createStripeCheckoutSession(createdOrder);
                return ResponseEntity.ok(Map.of("redirectUrl", stripeUrl));

            case "COD":
            default:
                return ResponseEntity.ok(createdOrder);
        }
    }

    @GetMapping("/payment-return")
    public ResponseEntity<String> handleVnpayReturn(
            @RequestParam("vnp_TxnRef") String orderId,
            @RequestParam("vnp_ResponseCode") String code
    ) {
        boolean result = vnpayService.verifyAndUpdateOrder(orderId, code);

        return result
                ? ResponseEntity.ok("Thanh toán VNPAY thành công")
                : ResponseEntity.badRequest().body("Thanh toán thất bại");
    }

}
