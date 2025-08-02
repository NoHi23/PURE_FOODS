package com.spring.controller;

import com.spring.common.StripeService;
import com.spring.common.VnpayService;
import com.spring.dto.BestSellingProductDTO;
import com.spring.dto.OrderDTO;
import com.spring.entity.Notifications;
import com.spring.entity.Order;
import com.spring.entity.Products;
import com.spring.service.CartItemService;
import com.spring.service.NotificationService;
import com.spring.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private CartItemService cartItemService;

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

    @GetMapping("/top12-best-selling")
    public ResponseEntity<List<BestSellingProductDTO>> getTop12BestSellingProductsWithStats() {
        List<BestSellingProductDTO> list = orderService.getTop12BestSellingProductsWithStats();
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

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/payment-return")
    public ResponseEntity<?> handleVnpayReturn(
            @RequestParam("vnp_TxnRef") String orderId,
            @RequestParam("vnp_ResponseCode") String code
    ) {
        boolean result = vnpayService.verifyAndUpdateOrder(orderId, code);

        String redirectUrl;
        if (result) {
            // ✅ Lấy Order để lấy ra userId (customerId)
            Order order = orderService.getOrderEntityById(Integer.parseInt(orderId));

            order.setStatusID(2);
            orderService.updateOrder(order);

            int userId = order.getCustomerID();
            orderService.decreaseProductQuantitiesByOrderId(order.getOrderID());

            // ✅ Xóa giỏ hàng
            cartItemService.clearCartByUserId(userId);


            Notifications notify = new Notifications();
            notify.setUserId(userId);
            notify.setTitle("Đặt hàng thành công!");
            notify.setContent("Cảm ơn bạn đã thanh toán. Đơn hàng #" + orderId + " của bạn đã được đặt thành công.");
            notificationService.saveNotification(notify);

            redirectUrl = "http://localhost:3000/order-success/" + orderId;
        } else {
            redirectUrl = "http://localhost:3000/payment-failed";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }


    @PutMapping("/updateOrder/{orderId}")
    public ResponseEntity<?> updateOrder(
            @PathVariable("orderId") int orderId,
            @RequestBody Order orderUpdate) {

        try {
            Order existingOrder = orderService.getOrderEntityById(orderId);
            if (existingOrder == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }

            // Cập nhật các field
            existingOrder.setCustomerID(orderUpdate.getCustomerID());
            existingOrder.setTotalAmount(orderUpdate.getTotalAmount());
            existingOrder.setShippingAddress(orderUpdate.getShippingAddress());
            existingOrder.setShippingMethodID(orderUpdate.getShippingMethodID());
            existingOrder.setPaymentMethod(orderUpdate.getPaymentMethod());
            existingOrder.setStatusID(orderUpdate.getStatusID());
            existingOrder.setDriverID(orderUpdate.getDriverID());

            // Cập nhật vào DB
            orderService.updateOrder(existingOrder);


            // Nếu là VNPAY thì tạo redirectUrl
            if ("VNPAY".equalsIgnoreCase(orderUpdate.getPaymentMethod())) {
                OrderDTO orderDTO = new OrderDTO(existingOrder); // Convert sang DTO
                String vnpayUrl = vnpayService.createPaymentUrl(orderDTO);
                return ResponseEntity.ok(Map.of("redirectUrl", vnpayUrl));
            }
            if ("COD".equalsIgnoreCase(existingOrder.getPaymentMethod())) {
                // xử lý sau khi cập nhật COD
                existingOrder.setStatusID(4); // Đặt hàng thành công
                orderService.updateOrder(existingOrder);

                orderService.decreaseProductQuantitiesByOrderId(orderId);
                cartItemService.clearCartByUserId(existingOrder.getCustomerID());

                Notifications notify = new Notifications();
                notify.setUserId(existingOrder.getCustomerID());
                notify.setTitle("Đặt hàng thành công!");
                notify.setContent("Đơn hàng #" + existingOrder.getOrderID() + " của bạn đã được đặt thành công.");
                notificationService.saveNotification(notify);
            }

            return ResponseEntity.ok(existingOrder);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("orderId") int orderId,
            @RequestBody Map<String, Integer> request
    ) {
        try {
            int newStatusId = request.get("statusID");

            Order order = orderService.getOrderEntityById(orderId);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }

            order.setStatusID(newStatusId);
            orderService.updateOrder(order);

            return ResponseEntity.ok(Map.of(
                    "message", "Order status updated successfully!",
                    "status", 200
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Update status failed", "status", 500));
        }
    }

    @GetMapping("/hasPurchased")
    public ResponseEntity<?> hasPurchased(@RequestParam("userId") int userId, @RequestParam("productId") int productId) {
        try {
            boolean hasPurchased = orderService.hasCustomerBoughtProduct(userId, productId); // Gọi method mới
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Check purchased successfully!");
            response.put("status", 200);
            response.put("hasPurchased", hasPurchased);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


}