package com.spring.service.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dto.*;
import com.spring.entity.OrderStatus;
import com.spring.entity.User;
import com.spring.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExporterServiceImpl implements ExporterService {

    private static final Logger logger = LoggerFactory.getLogger(ExporterServiceImpl.class);

    @Autowired
    private ExporterDAO exporterDAO;

    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @Override
    public List<ExporterDTO> getAllExportRequests() {
        logger.info("Fetching all export requests");
        List<ExporterDTO> exportRequests = exporterDAO.getAllExportRequests();
        for (ExporterDTO exporterDTO : exportRequests) {
            if (exporterDTO.getStatusID() != null) {
                try {
                    Optional<OrderStatus> orderStatus = orderStatusService.findById(exporterDTO.getStatusID());
                    if (orderStatus.isPresent()) {
                        exporterDTO.setStatusName(orderStatus.get().getStatusName());
                    } else {
                        exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                    exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                }
            }
        }
        logger.info("Fetched {} export requests", exportRequests.size());
        return exportRequests;
    }

    @Override
    public ExporterDTO getExportRequestById(int orderId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        logger.info("Fetching export request for order ID: {}", orderId);
        ExporterDTO exporterDTO = exporterDAO.getExportRequestById(orderId);
        if (exporterDTO == null) {
            logger.warn("No export request found for order ID: {}", orderId);
            throw new IllegalArgumentException("No export request found for order ID: " + orderId);
        }
        if (exporterDTO.getStatusID() != null) {
            try {
                Optional<OrderStatus> orderStatus = orderStatusService.findById(exporterDTO.getStatusID());
                if (orderStatus.isPresent()) {
                    exporterDTO.setStatusName(orderStatus.get().getStatusName());
                } else {
                    exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                }
            } catch (Exception e) {
                logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
            }
        }
        logger.info("Fetched export request for order ID: {}", orderId);
        return exporterDTO;
    }

    @Override
    @Transactional
    public void createExportRequest(ExporterDTO exporterDTO, List<OrderDetailDTO> orderDetails, int exporterId) {
        if (exporterDTO.getOrderID() <= 0 || exporterDTO.getCustomerID() <= 0) {
            logger.error("orderID hoặc customerID không hợp lệ cho yêu cầu xuất hàng.");
            throw new IllegalArgumentException("orderID và customerID phải là các giá trị hợp lệ.");
        }
        // Kiểm tra trạng thái tài khoản Exporter
        User exporter = userService.findById(exporterId)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy Exporter với ID: " + exporterId));
        if (exporter.getStatus() == 1) {
            logger.error("Tài khoản Exporter ID {} đã bị khóa.", exporterId);
            throw new IllegalStateException("Tài khoản của bạn đã bị khóa.");
        }
        if (orderDetails == null || orderDetails.isEmpty()) {
            logger.error("Order details list is null or empty for order ID: {}", exporterDTO.getOrderID());
            throw new IllegalArgumentException("Order details cannot be null or empty");
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
        try {
            for (OrderDetailDTO detail : orderDetails) {
                if (!checkInventoryAvailability(detail.getProductID(), detail.getQuantity())) {
                    logger.error("Insufficient stock for product ID: {} in order ID: {}", detail.getProductID(), exporterDTO.getOrderID());
                    throw new IllegalStateException("Không đủ hàng cho sản phẩm ID: " + detail.getProductID());
                }
            }
            exporterDAO.createExportRequest(exporterDTO, orderDetails);
            updateOrderStatus(exporterDTO.getOrderID(), 3, exporterId); // Chuyển sang Shipped
            NotificationDTO notification = new NotificationDTO();
            notification.setUserId(exporterDTO.getCustomerID());
            notification.setTitle("Yêu cầu xuất hàng được tạo");
            notification.setContent("Yêu cầu xuất hàng ID: " + exporterDTO.getOrderID() + " đã được tạo và chuyển sang trạng thái Shipped.");
            notification.setIsRead(false);
            notification.setCreatedAt(new Date());
            notificationService.createNotification(notification);
            logger.info("Successfully created export request and updated to Shipped for order ID: {}", exporterDTO.getOrderID());
        } catch (Exception e) {
            logger.error("Failed to create export request for order ID: {}: {}", exporterDTO.getOrderID(), e.getMessage());
            throw new RuntimeException("Failed to create export request: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void cancelExportRequest(int orderId, String cancelReason, int exporterId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        // Kiểm tra trạng thái tài khoản Exporter
        User exporter = userService.findById(exporterId)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy Exporter với ID: " + exporterId));
        if (exporter.getStatus() == 1) {
            logger.error("Tài khoản Exporter ID {} không tồn tại hoặc đã bị khóa.", exporterId);
            throw new IllegalStateException("Tài khoản của bạn đã bị khóa.");
        }
        logger.info("Canceling export request for order ID: {} by exporter ID: {}", orderId, exporterId);
        if (cancelReason == null || cancelReason.trim().isEmpty()) {
            logger.error("Cancel reason is null or empty for order ID: {}", orderId);
            throw new IllegalArgumentException("Cancel reason cannot be null or empty");
        }
        OrderDTO orderDTO = orderService.getOrderById(orderId);
        if (orderDTO == null) {
            logger.error("Order not found for order ID: {}", orderId);
            throw new IllegalArgumentException("Order not found for order ID: " + orderId);
        }
        if (!List.of(1, 2).contains(orderDTO.getStatusID())) {
            logger.warn("Order not in Pending or Processing state for cancellation: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái Pending hoặc Processing: " + orderId);
        }
        exporterDAO.cancelExportRequest(orderId, cancelReason, exporterId);
        NotificationDTO notification = new NotificationDTO();
        notification.setUserId(orderDTO.getCustomerID());
        notification.setTitle("Đơn hàng bị hủy");
        notification.setContent("Đơn hàng ID: " + orderId + " đã bị hủy vì: " + cancelReason);
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());
        notificationService.createNotification(notification);
        logger.info("Successfully canceled export request for order ID: {}", orderId);
    }

    @Override
    @Transactional
    public void requestCancelOrder(int orderId, String cancelReason, int customerId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        // Kiểm tra trạng thái tài khoản Customer
        User customer = userService.findById(customerId)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy Customer với ID: " + customerId));
        if (customer.getStatus() == 1) {
            logger.error("Tài khoản Customer ID {} không tồn tại hoặc đã bị khóa.", customerId);
            throw new IllegalStateException("Tài khoản của bạn đã bị khóa.");
        }
        logger.info("Customer {} requesting cancellation for order ID: {}", customerId, orderId);
        if (cancelReason == null || cancelReason.trim().isEmpty()) {
            logger.error("Cancel reason is null or empty for order ID: {}", orderId);
            throw new IllegalArgumentException("Cancel reason cannot be null or empty");
        }
        OrderDTO orderDTO = orderService.getOrderById(orderId);
        if (orderDTO == null) {
            logger.error("Order not found for order ID: {}", orderId);
            throw new IllegalArgumentException("Order not found for order ID: " + orderId);
        }
        if (orderDTO.getCustomerID() != customerId) {
            logger.error("Customer ID {} does not match order's customer ID {}", customerId, orderDTO.getCustomerID());
            throw new IllegalArgumentException("Bạn không có quyền yêu cầu hủy đơn hàng này.");
        }
        if (!List.of(1, 2).contains(orderDTO.getStatusID())) {
            logger.warn("Order not in Pending or Processing state for cancellation request: {}", orderId);
            throw new IllegalArgumentException("Đơn hàng không ở trạng thái Pending hoặc Processing: " + orderId);
        }
        exporterDAO.requestCancelOrder(orderId, cancelReason, customerId);
        NotificationDTO notification = new NotificationDTO();
        notification.setUserId(orderDTO.getCustomerID());
        notification.setTitle("Yêu cầu hủy đơn hàng");
        notification.setContent("Yêu cầu hủy đơn hàng ID: " + orderId + " đã được gửi với lý do: " + cancelReason);
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());
        notificationService.createNotification(notification);
        logger.info("Successfully requested cancellation for order ID: {}", orderId);
    }

    @Override
    @Transactional
    public void updateOrderStatus(int orderId, int newStatusId, int exporterId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        // Kiểm tra trạng thái tài khoản Exporter hoặc Shipper
        User user = userService.findById(exporterId)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy người dùng với ID: " + exporterId));
        if (user.getStatus() == 1) {
            logger.error("Tài khoản người dùng ID {} đã bị khóa.", exporterId);
            throw new IllegalStateException("Tài khoản của bạn đã bị khóa.");
        }
        if (newStatusId == 4 && user.getRoleID() != 6) {
            logger.error("Chỉ Shipper (RoleID = 6) mới có thể cập nhật trạng thái sang Delivered.");
            throw new IllegalArgumentException("Chỉ Shipper mới có thể cập nhật trạng thái sang Delivered.");
        }
        if (newStatusId != 4 && user.getRoleID() != 5) {
            logger.error("Chỉ Exporter (RoleID = 5) mới có thể cập nhật trạng thái sang Processing, Shipped hoặc Cancelled.");
            throw new IllegalArgumentException("Chỉ Exporter mới có thể cập nhật trạng thái này.");
        }
        if (!List.of(2, 3, 4, 5).contains(newStatusId)) {
            logger.error("Invalid statusID: {}", newStatusId);
            throw new IllegalArgumentException("statusID không hợp lệ! Chỉ chấp nhận các giá trị: 2, 3, 4, 5");
        }
        OrderDTO orderDTO = orderService.getOrderById(orderId);
        if (orderDTO == null) {
            logger.error("Order not found for order ID: {}", orderId);
            throw new IllegalArgumentException("Order not found for order ID: " + orderId);
        }
        int currentStatusId = orderDTO.getStatusID();
        if (!isValidStatusTransition(currentStatusId, newStatusId)) {
            logger.error("Invalid status transition from {} to {} for order ID: {}", currentStatusId, newStatusId, orderId);
            throw new IllegalArgumentException("Chuyển trạng thái không hợp lệ từ " + currentStatusId + " sang " + newStatusId);
        }
        exporterDAO.updateOrderStatus(orderId, newStatusId, exporterId);
        NotificationDTO notification = new NotificationDTO();
        notification.setUserId(orderDTO.getCustomerID());
        notification.setTitle("Cập nhật trạng thái đơn hàng");
        Optional<OrderStatus> orderStatus = orderStatusService.findById(newStatusId);
        String statusName = orderStatus.isPresent() ? orderStatus.get().getStatusName() : getDefaultStatusName(newStatusId);
        notification.setContent("Đơn hàng ID: " + orderId + " đã được cập nhật sang trạng thái: " + statusName);
        notification.setIsRead(false);
        notification.setCreatedAt(new Date());
        notificationService.createNotification(notification);
        logger.info("Successfully updated status for order ID: {}", orderId);
    }

    private boolean isValidStatusTransition(int currentStatusId, int newStatusId) {
        return (currentStatusId == 1 && newStatusId == 2) || // Pending → Processing
                (currentStatusId == 2 && (newStatusId == 3 || newStatusId == 5)) || // Processing → Shipped or Cancelled
                (currentStatusId == 3 && newStatusId == 4); // Shipped → Delivered
    }

    private String getDefaultStatusName(int statusId) {
        switch (statusId) {
            case 1:
                return "Chờ xử lý";
            case 2:
                return "Đang xử lý";
            case 3:
                return "Đã giao hàng";
            case 4:
                return "Đã giao";
            case 5:
                return "Đã hủy";
            default:
                return "Chờ xử lý"; // Giá trị mặc định nếu statusId không xác định
        }
    }

    @Override
    public List<ExporterDTO> getExportHistory(Integer statusId, String startDate, String endDate, String filterType) {
        logger.info("Fetching export history with statusId: {}, startDate: {}, endDate: {}, filterType: {}", statusId, startDate, endDate, filterType);
        List<ExporterDTO> exportHistory = exporterDAO.getExportHistory(statusId, startDate, endDate, filterType);
        for (ExporterDTO exporterDTO : exportHistory) {
            if (exporterDTO.getStatusID() != null) {
                try {
                    Optional<OrderStatus> orderStatus = orderStatusService.findById(exporterDTO.getStatusID());
                    if (orderStatus.isPresent()) {
                        exporterDTO.setStatusName(orderStatus.get().getStatusName());
                    } else {
                        exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                    exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                }
            }
            if (exporterDTO.getCancelReason() == null || exporterDTO.getCancelReason().trim().isEmpty()) {
                exporterDTO.setCancelReason("Không có lý do hủy được cung cấp");
            }
            if (exporterDTO.getCancelRequestReason() == null || exporterDTO.getCancelRequestReason().trim().isEmpty()) {
                exporterDTO.setCancelRequestReason("Không có lý do yêu cầu hủy được cung cấp");
            }
        }
        logger.info("Fetched {} orders for export history", exportHistory.size());
        return exportHistory;
    }

    @Override
    public List<NotificationDTO> getNotificationsByUserId(int userId) {
        logger.info("Fetching notifications for user ID: {}", userId);
        List<NotificationDTO> notifications = exporterDAO.getNotificationsByUserId(userId);
        logger.info("Fetched {} notifications", notifications.size());
        return notifications;
    }

    @Override
    public boolean checkInventoryAvailability(int productId, int quantity) {
        logger.info("Checking inventory availability for product ID: {} with quantity: {}", productId, quantity);
        return exporterDAO.checkInventoryAvailability(productId, quantity);
    }

    @Override
    public List<ExporterDTO> trackExportOrders(Integer statusId, String startDate, String endDate) {
        logger.info("Tracking export orders with statusId: {}, startDate: {}, endDate: {}", statusId, startDate, endDate);
        List<ExporterDTO> orders = exporterDAO.trackExportOrders(statusId, startDate, endDate);
        for (ExporterDTO exporterDTO : orders) {
            if (exporterDTO.getStatusID() != null) {
                try {
                    Optional<OrderStatus> orderStatus = orderStatusService.findById(exporterDTO.getStatusID());
                    if (orderStatus.isPresent()) {
                        exporterDTO.setStatusName(orderStatus.get().getStatusName());
                    } else {
                        exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                    }
                } catch (Exception e) {
                    logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                    exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                }
            }
        }
        logger.info("Fetched {} orders for tracking", orders.size());
        return orders;
    }

    @Override
    public ExporterDTO getOrderTrackingDetails(int orderId) {
        if (orderId <= 0) {
            logger.error("orderID không hợp lệ.");
            throw new IllegalArgumentException("orderID không hợp lệ.");
        }
        logger.info("Fetching tracking details for order ID: {}", orderId);
        ExporterDTO exporterDTO = exporterDAO.getOrderTrackingDetails(orderId);
        if (exporterDTO == null) {
            logger.warn("No order found for tracking with order ID: {}", orderId);
            throw new IllegalArgumentException("No order found for tracking with order ID: " + orderId);
        }
        if (exporterDTO.getStatusID() != null) {
            try {
                Optional<OrderStatus> orderStatus = orderStatusService.findById(exporterDTO.getStatusID());
                if (orderStatus.isPresent()) {
                    exporterDTO.setStatusName(orderStatus.get().getStatusName());
                } else {
                    exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
                }
            } catch (Exception e) {
                logger.warn("Could not fetch statusName for statusID {}: {}", exporterDTO.getStatusID(), e.getMessage());
                exporterDTO.setStatusName(getDefaultStatusName(exporterDTO.getStatusID()));
            }
        }
        logger.info("Fetched tracking details for order ID: {}", orderId);
        return exporterDTO;
    }

    @Override
    public Map<String, Integer> getExportStats() {
        logger.info("Fetching export stats");
        return exporterDAO.getExportStats();
    }

    @Override
    public List<ProductDTO> getInventoryProducts() {
        logger.info("Fetching inventory products");
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
}