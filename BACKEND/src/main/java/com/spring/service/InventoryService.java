package com.spring.service;

import com.spring.dto.OrderProductInventoryDTO;
import com.spring.entity.Orders;
import com.spring.entity.Products;
import com.spring.repository.OrderRepository;
import com.spring.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.spring.entity.OrderDetails;
import com.spring.entity.Products;
import com.spring.entity.Orders;
import com.spring.entity.OrderStatuses;
import com.spring.repository.OrderRepository;
import com.spring.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import com.spring.dto.ProductInventoryDTO;
import org.springframework.transaction.annotation.Transactional;
import com.spring.entity.InventoryLogs;
import com.spring.repository.InventoryLogsRepository;
import com.spring.entity.User;
import org.springframework.transaction.annotation.Transactional;
@Service
public class InventoryService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
@Autowired
private InventoryLogsRepository inventoryLogsRepository;

    public Integer checkStock(Integer productId) {
        Optional<Products> product = productRepository.findById(productId);
        return product.map(Products::getStockQuantity).orElse(0);
    }
@Transactional
    public Orders confirmOrder(Integer orderId) {
    Orders order = orderRepository.findByOrderId(orderId); // Sử dụng EntityGraph để fetch orderDetails
    if (order != null) {
        // Giảm stockQuantity cho từng sản phẩm trong orderDetails
        if (order.getOrderDetails() != null) {
            for (OrderDetails od : order.getOrderDetails()) {
                Products product = od.getProduct();
                if (product != null && od.getQuantity() != null) {
                    int oldStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                    int newStock = oldStock - od.getQuantity();
                    product.setStockQuantity(newStock);
                    productRepository.save(product);

                    // Lưu vào InventoryLogs
                    InventoryLogs log = new InventoryLogs();
                    log.setProduct(product);
                    log.setUser(order.getCustomer());
                    log.setQuantityChange(-od.getQuantity());
                    log.setReason("Xuất kho theo đơn hàng #" + order.getOrderId());
                    log.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
                    log.setStatus(1);
                    inventoryLogsRepository.save(log);
                }
            }
        }
        // Cập nhật trạng thái đơn hàng (ví dụ: Processing)
        OrderStatuses shippedStatus = new OrderStatuses();
        shippedStatus.setStatusId(6); // 6 = Preparing
        order.setStatus(shippedStatus);
        return orderRepository.save(order);
    }
    return null;
}
   public Orders rejectOrder(Integer orderId, String reason) {
    Optional<Orders> order = orderRepository.findById(orderId);
    if (order.isPresent()) {
        order.get().setCancelReason(reason);
        OrderStatuses cancelledStatus = new OrderStatuses();
        cancelledStatus.setStatusId(5); // 5 = Cancelled
        order.get().setStatus(cancelledStatus);
        return orderRepository.save(order.get());
    }
    return null;
}

    public void updateStock(Integer productId, Integer quantity) {
        Optional<Products> product = productRepository.findById(productId);
        product.ifPresent(p -> {
            p.setStockQuantity(p.getStockQuantity() - quantity);
            productRepository.save(p);
        });
    }

    public void notifyOutOfStock(Integer orderId) {
        // Logic gửi thông báo (cần NotificationService)
    }
 @Transactional(readOnly = true)
public List<OrderProductInventoryDTO> getProductsForExportRequest() {
    List<OrderProductInventoryDTO> result = new ArrayList<>();
    List<Orders> orders = orderRepository.findAll();
    for (Orders order : orders) {
        if (order.getStatus() != null
                && "Processing".equalsIgnoreCase(order.getStatus().getStatusName())
                && order.getOrderDetails() != null) {
            List<ProductInventoryDTO> products = new ArrayList<>();
            for (OrderDetails od : order.getOrderDetails()) {
                Products p = od.getProduct();
                if (p != null) {
                    products.add(new ProductInventoryDTO(
                        p.getProductId(),
                        p.getProductName(),
                        p.getStockQuantity(),
                        p.getWarningThreshold(),
                        od.getStatus() != null ? od.getStatus().toString() : null,
                         od.getQuantity() 
                    ));
                }
            }
            result.add(new OrderProductInventoryDTO(
                order.getOrderId(),
                    order.getCustomer() != null ? order.getCustomer().getUserId() : null,
                order.getCustomer() != null ? order.getCustomer().getFullName() : null,
                products
            ));
        }
    }
    return result;
}
}