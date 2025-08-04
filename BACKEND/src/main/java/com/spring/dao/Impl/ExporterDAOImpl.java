package com.spring.dao.Impl;

import com.spring.dao.*;
import com.spring.dto.*;
import com.spring.entity.*;
import com.spring.service.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@Transactional
public class ExporterDAOImpl implements ExporterDAO {

    private static final Logger logger = LoggerFactory.getLogger(ExporterDAOImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OrderDAO orderDAO;

    @Autowired
    private OrderDetailDAO orderDetailDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private OrderCancelRequestDAO orderCancelRequestDAO;

    @Autowired
    private InventoryLogsDAO inventoryLogsDAO;

    @Override
    public List<ExporterDTO> getAllExportRequests() {
        logger.info("Fetching all export requests (Pending)");
        String jpql = "SELECT o FROM Order o WHERE o.statusID = :statusId";
        List<Order> orders = entityManager.createQuery(jpql, Order.class)
                .setParameter("statusId", 1) // Lấy đơn hàng ở trạng thái Pending
                .getResultList();
        List<ExporterDTO> result = new ArrayList<>();
        for (Order order : orders) {
            User customer = userDAO.findById(order.getCustomerID());
            if (customer != null && customer.getRoleID() == 2 && customer.getStatus() == 0) { // Giữ nguyên ==0 cho active
                result.add(convertToExporterDTO(orderService.getOrderById(order.getOrderID())));
            } else {
                if (customer == null) {
                    logger.warn("Skipped order ID {} because customer not found", order.getOrderID());
                } else if (customer.getRoleID() != 2) {
                    logger.warn("Skipped order ID {} because customer roleID != 2", order.getOrderID());
                } else {
                    logger.warn("Skipped order ID {} because customer status != 0 (locked)", order.getOrderID());
                }
            }
        }
        logger.info("Fetched {} export requests (Pending) after filtering by customer roleID=2 and status=0", result.size());
        return result;
    }

    @Override
    public ExporterDTO getExportRequestById(int orderId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        try {
            OrderDTO order = orderService.getOrderById(orderId);
            if (order == null) {
                logger.warn("No order found for ID: {}", orderId);
                return null;
            }
            return convertToExporterDTO(order);
        } catch (RuntimeException e) {
            logger.error("Error fetching export request by ID {}: {}", orderId, e.getMessage());
            return null;
        }
    }

    @Override
    public void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails) {
        if (exporterDTO.getOrderID() <= 0 || exporterDTO.getCustomerID() <= 0) {
            logger.error("orderID hoặc customerID không hợp lệ.");
            throw new IllegalArgumentException("orderID và customerID phải là các giá trị hợp lệ.");
        }
        if (orderDetails == null || orderDetails.isEmpty()) {
            logger.error("Order details are null or empty for order ID: {}", exporterDTO.getOrderID());
            throw new IllegalArgumentException("Chi tiết đơn hàng không được rỗng cho đơn hàng ID: " + exporterDTO.getOrderID());
        }
        OrderDTO orderDTO = orderService.getOrderById(exporterDTO.getOrderID());
        if (orderDTO == null) {
            logger.error("Order not found for order ID: {}", exporterDTO.getOrderID());
            throw new IllegalArgumentException("Đơn hàng không tồn tại với orderID: " + exporterDTO.getOrderID());
        }
        if (orderDTO.getStatusID() != 2) {
            logger.error("Order must be in Processing state (statusID = 2) to create export request, current status: {}", orderDTO.getStatusID());
            throw new IllegalArgumentException("Đơn hàng phải ở trạng thái Processing (statusID = 2) để tạo yêu cầu xuất hàng.");
        }
        if (orderDTO.getStatusID() == 5) {
            logger.warn("Attempt to create export request for canceled order ID: {}", exporterDTO.getOrderID());
            throw new IllegalArgumentException("Đơn hàng với ID: " + exporterDTO.getOrderID() + " đã bị hủy");
        }
        User customer = userDAO.findById(exporterDTO.getCustomerID());
        if (customer == null) {
            logger.error("Customer not found for ID: {}", exporterDTO.getCustomerID());
            throw new IllegalArgumentException("Không tìm thấy thông tin khách hàng với ID: " + exporterDTO.getCustomerID());
        }
        if (customer.getRoleID() != 2) { // Kiểm tra roleID == 2
            logger.error("Customer roleID {} is not 2 for order ID: {}", customer.getRoleID(), exporterDTO.getOrderID());
            throw new IllegalArgumentException("Chỉ chấp nhận đơn hàng từ khách hàng (roleID = 2)");
        }
        Order orderEntity = orderDAO.getOrderById(exporterDTO.getOrderID());
        if (orderEntity == null) {
            logger.error("Order entity not found for ID: {}", exporterDTO.getOrderID());
            throw new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + exporterDTO.getOrderID());
        }
        orderEntity.setCustomerID(exporterDTO.getCustomerID() != 0 ? exporterDTO.getCustomerID() : orderDTO.getCustomerID());
        orderEntity.setOrderDate(exporterDTO.getOrderDate() != null ? exporterDTO.getOrderDate() : orderDTO.getOrderDate());
        orderEntity.setTotalAmount(exporterDTO.getTotalAmount() != null ? exporterDTO.getTotalAmount() : orderDTO.getTotalAmount());
        orderEntity.setDiscountAmount(exporterDTO.getDiscountAmount() != null ? exporterDTO.getDiscountAmount() : orderDTO.getDiscountAmount());
        orderEntity.setShippingAddress(exporterDTO.getShippingAddress() != null ? exporterDTO.getShippingAddress() : orderDTO.getShippingAddress());
        orderEntity.setStatusID(exporterDTO.getStatusID() != null ? exporterDTO.getStatusID() : orderDTO.getStatusID());
        orderEntity.setShippingMethodID(exporterDTO.getShippingMethodID() != 0 ? exporterDTO.getShippingMethodID() : orderDTO.getShippingMethodID());
        orderEntity.setShippingCost(exporterDTO.getShippingCost() != null ? exporterDTO.getShippingCost() : orderDTO.getShippingCost());
        orderEntity.setDistance(exporterDTO.getDistance() != null ? exporterDTO.getDistance() : orderDTO.getDistance());
        orderDAO.updateOrder(orderEntity);
        logger.info("Updated order ID: {}", orderDTO.getOrderID());
        orderDetailDAO.deleteByOrderId(exporterDTO.getOrderID());
        for (OrderDetailDTO detail : orderDetails) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrderID(exporterDTO.getOrderID());
            orderDetail.setProductID(detail.getProductID());
            orderDetail.setQuantity(detail.getQuantity());
            orderDetail.setUnitPrice(detail.getUnitPrice());
            orderDetail.setStatus(detail.getStatus() != 0 ? detail.getStatus() : 1);
            orderDetailDAO.save(orderDetail);
            ProductDTO product = productService.getProductById(detail.getProductID());
            if (product != null) {
                int newStockQuantity = product.getStockQuantity() - detail.getQuantity();
                product.setStockQuantity(newStockQuantity);
                productService.updateProduct(product);
                InventoryLogs log = new InventoryLogs();
                log.setProductId(detail.getProductID());
                log.setUserId(exporterDTO.getCustomerID());
                log.setQuantityChange(-detail.getQuantity());
                log.setReason("Exported for order " + exporterDTO.getOrderID());
                log.setCreatedAt(new Date());
                log.setStatus(1);
                inventoryLogsDAO.addInventoryLog(log);
                logger.info("Logged inventory change for product ID {}: quantity {}, order ID {}", detail.getProductID(), -detail.getQuantity(), exporterDTO.getOrderID());
            }
        }
    }

    @Override
    public void cancelExportRequest(int orderId, String cancelReason, int exporterId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        Order order = entityManager.find(Order.class, orderId);
        if (order == null) {
            logger.error("Order not found for cancellation: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không tồn tại: " + orderId);
        }
        if (!List.of(1, 2).contains(order.getStatusID())) {
            logger.warn("Order not in Pending or Processing state for cancellation: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái Pending hoặc Processing: " + orderId);
        }
        User exporter = userDAO.findById(exporterId);
        if (exporter == null || exporter.getRoleID() != 5) {
            logger.error("Invalid exporter: not an Exporter role (RoleID = 5)");
            throw new IllegalArgumentException("Người dùng không có quyền Exporter (RoleID = 5)");
        }
        if (exporter.getStatus() == 1) { // Sửa từ != 0 thành == 1 (locked nếu ==1)
            logger.error("Exporter account is locked (Status == 1) for user ID: {}", exporterId);
            throw new IllegalStateException("Tài khoản Exporter bị khóa, không thể hủy đơn hàng.");
        }
        order.setStatusID(5);
        order.setCancelReason(cancelReason);
        entityManager.merge(order);
        OrderCancelRequest cancelRequest = orderCancelRequestDAO.findByOrderId(orderId);
        if (cancelRequest != null) {
            cancelRequest.setProcessed(true);
            orderCancelRequestDAO.update(cancelRequest);
        }
        logger.info("Order {} cancelled by exporter ID {}: {}", orderId, exporterId, cancelReason);
    }

    @Override
    public void requestCancelOrder(int orderId, String cancelReason, int customerId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        Order order = entityManager.find(Order.class, orderId);
        if (order == null) {
            logger.error("Order not found for cancellation request: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không tồn tại: " + orderId);
        }
        if (order.getCustomerID() != customerId) {
            logger.error("Customer ID {} does not match order's customer ID {}", customerId, order.getCustomerID());
            throw new IllegalArgumentException("Bạn không có quyền yêu cầu hủy đơn hàng này.");
        }
        if (!List.of(1, 2).contains(order.getStatusID())) {
            logger.warn("Order not in Pending or Processing state for cancellation request: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái Pending hoặc Processing: " + orderId);
        }
        User customer = userDAO.findById(customerId);
        if (customer == null) {
            logger.error("Customer not found for ID: {}", customerId);
            throw new IllegalArgumentException("Không tìm thấy thông tin khách hàng với ID: " + customerId);
        }
        if (customer.getRoleID() != 2) { // Kiểm tra roleID == 2
            logger.error("User roleID {} is not 2 for cancel request on order ID: {}", customer.getRoleID(), orderId);
            throw new IllegalArgumentException("Chỉ khách hàng (roleID = 2) mới có quyền yêu cầu hủy đơn hàng");
        }
        if (customer.getStatus() == 1) { // Sửa từ != 0 thành == 1 (locked nếu ==1)
            logger.error("Customer account is locked (Status == 1) for user ID: {}", customerId);
            throw new IllegalStateException("Tài khoản khách hàng bị khóa, không thể yêu cầu hủy đơn hàng.");
        }
        OrderCancelRequest cancelRequest = new OrderCancelRequest();
        cancelRequest.setOrderID(orderId);
        cancelRequest.setCustomerID(customerId);
        cancelRequest.setCancelRequestReason(cancelReason);
        cancelRequest.setCancelRequestedAt(new Date());
        cancelRequest.setProcessed(false);
        orderCancelRequestDAO.save(cancelRequest);
        logger.info("Order {} cancel request submitted by customer ID {}: {}", orderId, customerId, cancelReason);
    }

    @Override
    public void updateOrderStatus(int orderId, int newStatusId, int exporterId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        Order order = entityManager.find(Order.class, orderId);
        if (order == null) {
            logger.error("Order not found for status update: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không tồn tại: " + orderId);
        }
        if (!List.of(2, 3, 4, 5).contains(newStatusId)) {
            logger.error("Invalid statusID: {}", newStatusId);
            throw new IllegalArgumentException("statusID không hợp lệ! Chỉ chấp nhận các giá trị: 2, 3, 4, 5");
        }
        User user = userDAO.findById(exporterId);
        if (user == null) {
            logger.error("User not found for ID: {}", exporterId);
            throw new IllegalArgumentException("Người dùng không tồn tại với ID: " + exporterId);
        }
        if (newStatusId == 4 && user.getRoleID() != 6) {
            logger.error("Only Shipper (RoleID = 6) can update status to Delivered.");
            throw new IllegalArgumentException("Chỉ Shipper mới có thể cập nhật trạng thái sang Delivered.");
        }
        if (newStatusId != 4 && user.getRoleID() != 5) {
            logger.error("Only Exporter (RoleID = 5) can update status to Processing, Shipped, or Cancelled.");
            throw new IllegalArgumentException("Chỉ Exporter mới có thể cập nhật trạng thái này.");
        }
        if (user.getStatus() == 1) { // Sửa từ != 0 thành == 1 (locked nếu ==1)
            logger.error("User account is locked (Status == 1) for user ID: {}", exporterId);
            throw new IllegalStateException("Tài khoản người dùng bị khóa, không thể cập nhật trạng thái đơn hàng.");
        }
        int currentStatusId = order.getStatusID();
        if (!isValidStatusTransition(currentStatusId, newStatusId)) {
            logger.error("Invalid status transition from {} to {} for order ID: {}", currentStatusId, newStatusId, orderId);
            throw new IllegalArgumentException("Chuyển trạng thái không hợp lệ từ " + currentStatusId + " sang " + newStatusId);
        }
        order.setStatusID(newStatusId);
        entityManager.merge(order);
        logger.info("Order {} status updated to {} by user ID {}", orderId, newStatusId, exporterId);
    }

    private boolean isValidStatusTransition(int currentStatusId, int newStatusId) {
        return (currentStatusId == 1 && newStatusId == 2) || // Pending → Processing
                (currentStatusId == 2 && (newStatusId == 3 || newStatusId == 5)) || // Processing → Shipped or Cancelled
                (currentStatusId == 3 && newStatusId == 4); // Shipped → Delivered
    }

    @Override
    public List<NotificationDTO> getNotificationsByUserId(int userId) {
        try {
            List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(userId);
            logger.info("Fetched {} notifications for user ID {}", notifications.size(), userId);
            return notifications;
        } catch (RuntimeException e) {
            logger.error("Error fetching notifications for user ID {}: {}", userId, e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean checkInventoryAvailability(int productId, int quantity) {
        try {
            ProductDTO product = productService.getProductById(productId);
            if (product == null) {
                logger.error("Product not found for ID: {}", productId);
                return false;
            }
            boolean available = product.getStockQuantity() >= quantity;
            logger.info("Inventory check for product ID {}: requested quantity {}, available quantity {}, available {}", productId, quantity, product.getStockQuantity(), available);
            return available;
        } catch (RuntimeException e) {
            logger.error("Error checking inventory for product ID {}: {}", productId, e.getMessage());
            return false;
        }
    }

    @Override
    public List<ExporterDTO> getExportHistory(Integer statusId, String startDate, String endDate, String filterType) {
        String jpql = "SELECT o FROM Order o";
        if (filterType != null) {
            if (filterType.equals("success")) {
                jpql += " WHERE o.statusID IN (3,4)"; // Shipped, Delivered
            } else if (filterType.equals("cancelled")) {
                jpql += " WHERE o.statusID = 5"; // Cancelled
            }
        } else if (statusId != null) {
            jpql += " WHERE o.statusID = :statusId";
        }
        var query = entityManager.createQuery(jpql, Order.class);
        if (statusId != null && filterType == null) {
            query.setParameter("statusId", statusId);
        }
        List<Order> orders = query.getResultList();
        List<ExporterDTO> result = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            for (Order order : orders) {
                boolean include = true;
                if (startDate != null && !startDate.isEmpty()) {
                    Date start = sdf.parse(startDate);
                    if (order.getOrderDate().before(start)) include = false;
                }
                if (endDate != null && !endDate.isEmpty()) {
                    Date end = sdf.parse(endDate);
                    if (order.getOrderDate().after(end)) include = false;
                }
                if (include) {
                    ExporterDTO dto = convertToExporterDTO(orderService.getOrderById(order.getOrderID()));
                    List<InventoryLogs> logs = inventoryLogsDAO.getLogsByReason("Exported for order " + order.getOrderID());
                    if (!logs.isEmpty()) {
                        StringBuilder logDetails = new StringBuilder();
                        logs.forEach(log -> logDetails.append("Product ID: ").append(log.getProductId())
                                .append(", Quantity: ").append(log.getQuantityChange())
                                .append(", Date: ").append(log.getCreatedAt()).append("; "));
                        dto.setCancelRequestReason(logDetails.toString());
                    }
                    result.add(dto);
                }
            }
            logger.info("Fetched {} orders for export history with filterType: {}", result.size(), filterType);
            return result;
        } catch (Exception e) {
            logger.error("Error parsing dates: {}", e.getMessage());
            throw new RuntimeException("Invalid date format");
        }
    }

    @Override
    public List<ExporterDTO> trackExportOrders(Integer statusId, String startDate, String endDate) {
        try {
            String jpql = statusId != null ? "SELECT o FROM Order o WHERE o.statusID = :statusId" : "SELECT o FROM Order o";
            var query = entityManager.createQuery(jpql, Order.class);
            if (statusId != null) {
                query.setParameter("statusId", statusId);
            }
            List<Order> orders = query.getResultList();
            List<ExporterDTO> result = new ArrayList<>();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            for (Order order : orders) {
                boolean include = true;
                if (startDate != null && !startDate.isEmpty()) {
                    Date start = sdf.parse(startDate);
                    if (order.getOrderDate().before(start)) {
                        include = false;
                    }
                }
                if (endDate != null && !endDate.isEmpty()) {
                    Date end = sdf.parse(endDate);
                    if (order.getOrderDate().after(end)) {
                        include = false;
                    }
                }
                if (include) {
                    result.add(convertToExporterDTO(orderService.getOrderById(order.getOrderID())));
                }
            }
            logger.info("Fetched {} orders for tracking with statusId: {}, startDate: {}, endDate: {}",
                    result.size(), statusId != null ? statusId : "all", startDate != null ? startDate : "none", endDate != null ? endDate : "none");
            return result;
        } catch (Exception e) {
            logger.error("Error tracking export orders: {}", e.getMessage());
            throw new RuntimeException("Error tracking export orders: " + e.getMessage());
        }
    }

    @Override
    public ExporterDTO getOrderTrackingDetails(int orderId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        try {
            OrderDTO order = orderService.getOrderById(orderId);
            if (order == null) {
                logger.warn("No order found for tracking with ID: {}", orderId);
                throw new IllegalArgumentException("No order found for tracking with ID: " + orderId);
            }
            ExporterDTO exporterDTO = convertToExporterDTO(order);
            return exporterDTO;
        } catch (RuntimeException e) {
            logger.error("Error fetching tracking details for order ID {}: {}", orderId, e.getMessage());
            throw new RuntimeException("Error fetching tracking details for order ID: " + orderId + ": " + e.getMessage());
        }
    }

    @Override
    public Map<String, Integer> getExportStats() {
        Map<String, Integer> stats = new HashMap<>();
        long total = entityManager.createQuery("SELECT COUNT(o) FROM Order o", Long.class)
                .getSingleResult();
        stats.put("total", (int) total);
        long pendingCancelled = entityManager.createQuery("SELECT COUNT(o) FROM Order o WHERE o.statusID IN (1,5)", Long.class)
                .getSingleResult();
        stats.put("pendingCancelled", (int) pendingCancelled);
        long confirmed = entityManager.createQuery("SELECT COUNT(o) FROM Order o WHERE o.statusID IN (3,4)", Long.class)
                .getSingleResult();
        stats.put("confirmed", (int) confirmed);
        logger.info("Fetched export stats: {}", stats);
        return stats;
    }

    @Override
    public List<ProductDTO> getInventoryProducts() {
        try {
            List<ProductDTO> products = productService.getAllProduct().stream()
                    .filter(p -> p.getStockQuantity() > 0)
                    .collect(Collectors.toList());
            logger.info("Fetched {} products in inventory", products.size());
            return products;
        } catch (RuntimeException e) {
            logger.error("Error fetching inventory products: {}", e.getMessage());
            throw new RuntimeException("Error fetching inventory products: " + e.getMessage());
        }
    }

    private ExporterDTO convertToExporterDTO(OrderDTO order) {
        User customer = userDAO.findById(order.getCustomerID());
        List<OrderDetail> details = orderDetailDAO.findByOrderID(order.getOrderID());
        List<ExporterDTO.OrderDetailInfo> detailInfos = new ArrayList<>();
        for (OrderDetail detail : details) {
            ProductDTO product = productService.getProductById(detail.getProductID());
            ExporterDTO.OrderDetailInfo detailInfo = new ExporterDTO.OrderDetailInfo();
            detailInfo.setOrderDetailID(detail.getOrderDetailID());
            detailInfo.setProductID(detail.getProductID());
            detailInfo.setProductName(product != null ? product.getProductName() : "Unknown");
            detailInfo.setQuantity(detail.getQuantity());
            detailInfo.setUnitPrice(detail.getUnitPrice());
            detailInfo.setStockQuantity(product != null ? product.getStockQuantity() : 0);
            detailInfo.setStatus(detail.getStatus());
            detailInfos.add(detailInfo);
        }
        ExporterDTO exporterDTO = new ExporterDTO();
        exporterDTO.setOrderID(order.getOrderID());
        exporterDTO.setCustomerID(order.getCustomerID());
        exporterDTO.setCustomerName(customer != null ? customer.getFullName() : "Unknown");
        exporterDTO.setCustomerEmail(customer != null ? customer.getEmail() : "Unknown");
        exporterDTO.setOrderDate(order.getOrderDate());
        exporterDTO.setTotalAmount(order.getTotalAmount());
        exporterDTO.setDiscountAmount(order.getDiscountAmount());
        exporterDTO.setShippingAddress(order.getShippingAddress());
        exporterDTO.setStatusID(order.getStatusID());
        exporterDTO.setShippingMethodID(order.getShippingMethodID());
        exporterDTO.setShippingCost(order.getShippingCost());
        exporterDTO.setDistance(order.getDistance());
        if (order.getStatusID() == 5) {
            exporterDTO.setCancelReason(order.getCancelReason());
        }
        OrderCancelRequest cancelRequest = orderCancelRequestDAO.findByOrderId(order.getOrderID());
        if (cancelRequest != null) {
            exporterDTO.setCancelRequestReason(cancelRequest.getCancelRequestReason());
        }
        exporterDTO.setOrderDetails(detailInfos);
        logger.info("Converted OrderDTO to ExporterDTO for order ID {}", order.getOrderID());
        return exporterDTO;
    }
}