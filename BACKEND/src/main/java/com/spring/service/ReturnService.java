package com.spring.service;

import com.spring.entity.OrderStatuses;
import com.spring.entity.Orders;
import com.spring.entity.ReturnOrders;
import com.spring.entity.User;
import com.spring.repository.ReturnOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.spring.repository.OrderRepository;
import com.spring.entity.OrderDetails;
import com.spring.entity.Products;
import com.spring.entity.InventoryLogs;
import com.spring.repository.ProductRepository;
import com.spring.repository.InventoryLogsRepository;
@Service
public class ReturnService {

    @Autowired
    private ReturnOrderRepository returnOrderRepository;

    @Autowired
private ProductRepository productRepository;
@Autowired
private InventoryLogsRepository inventoryLogsRepository;

@Autowired
private OrderRepository orderRepository;
  public ReturnOrders recordReturn(Integer orderId, String reason, Integer processBy) {
     // Lấy đơn hàng
    Optional<Orders> orderOpt = orderRepository.findById(orderId);
      if (!orderOpt.isPresent()) {
        return null;
    }
    Orders order = orderOpt.get();
    // Kiểm tra trạng thái đơn hàng
    if (!"Delivered".equals(order.getStatus().getStatusName())) {
        return null; // Chỉ cho phép trả hàng khi đã giao thành công
    }
    
    // Kiểm tra đã có return order cho orderId chưa
    List<ReturnOrders> existing = returnOrderRepository.findByOrder_OrderId(orderId);
    if (!existing.isEmpty()) {
        return null; // hoặc throw exception tùy ý bạn
    }
    ReturnOrders returnOrder = new ReturnOrders();
    returnOrder.setOrder(new Orders(orderId));
    returnOrder.setReturnReason(reason);
    returnOrder.setReturnDate(new java.sql.Timestamp(System.currentTimeMillis()));
    OrderStatuses status = new OrderStatuses();
    status.setStatusId(1); // Set statusId = 1
    returnOrder.setStatus(status);
    User user = new User();
    user.setUserId(processBy);
    returnOrder.setProcessedBy(user); // Set processBy
    return returnOrderRepository.save(returnOrder);
}

public ReturnOrders createReturnOrder(Integer orderId, Integer processBy) {
    // Kiểm tra đã có return order cho orderId chưa
    List<ReturnOrders> existing = returnOrderRepository.findByOrder_OrderId(orderId);
    if (!existing.isEmpty()) {
        return null; // hoặc throw exception tùy ý bạn
    }
    ReturnOrders returnOrder = new ReturnOrders();
    returnOrder.setOrder(new Orders(orderId));
    returnOrder.setReturnDate(new java.sql.Timestamp(System.currentTimeMillis()));
    OrderStatuses status = new OrderStatuses();
    status.setStatusId(1); // Set statusId = 1
    returnOrder.setStatus(status);
    User user = new User();
    user.setUserId(processBy);
    returnOrder.setProcessedBy(user); // Set processBy
    return returnOrderRepository.save(returnOrder);
}
    public void updateInventoryAfterReturn(Integer returnOrderId) {
    Optional<ReturnOrders> optional = returnOrderRepository.findById(returnOrderId);
    if (optional.isPresent()) {
        ReturnOrders returnOrder = optional.get();
        Orders order = returnOrder.getOrder();
        if (order != null && order.getOrderDetails() != null) {
            for (OrderDetails od : order.getOrderDetails()) {
                Products product = od.getProduct();
                if (product != null && od.getQuantity() != null) {
                    // Tăng lại số lượng tồn kho
                    int oldStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                    int newStock = oldStock + od.getQuantity();
                    product.setStockQuantity(newStock);
                    productRepository.save(product);

                    // Ghi log vào InventoryLogs
                    InventoryLogs log = new InventoryLogs();
                    log.setProduct(product);
                    log.setUser(returnOrder.getProcessedBy());
                    log.setQuantityChange(od.getQuantity());
                    log.setReason("Nhập lại kho do trả hàng cho đơn #" + order.getOrderId());
                    log.setCreatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
                    log.setStatus(1);
                    inventoryLogsRepository.save(log);
                }
            }
        }
    }
}

    public List<ReturnOrders> getAllReturns() {
        return returnOrderRepository.findAll();
    }

    public ReturnOrders editReturnReason(Integer returnOrderId, String reason) {
        Optional<ReturnOrders> optional = returnOrderRepository.findById(returnOrderId);
        if (optional.isPresent()) {
            ReturnOrders order = optional.get();
            order.setReturnReason(reason);
            return returnOrderRepository.save(order);
        }
        return null;
    }
}