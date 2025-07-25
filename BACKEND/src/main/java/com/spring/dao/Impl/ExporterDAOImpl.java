package com.spring.dao.Impl;

import com.spring.dao.ExporterDAO;
import com.spring.dao.OrderDAO;
import com.spring.dao.OrderDetailDAO;
import com.spring.dao.UserDAO;
import com.spring.dao.DriverDAO;
import com.spring.dto.ExporterDTO;
import com.spring.dto.OrderDetailDTO;
import com.spring.dto.InventoryLogsDTO;
import com.spring.dto.OrderDTO;
import com.spring.dto.ProductDTO;
import com.spring.dto.UserDTO;
import com.spring.entity.Order;
import com.spring.entity.OrderDetail;
import com.spring.entity.User;
import com.spring.entity.Driver;
import com.spring.service.InventoryLogsService;
import com.spring.service.OrderDetailService;
import com.spring.service.OrderService;
import com.spring.service.ProductService;
import com.spring.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@Transactional
public class ExporterDAOImpl implements ExporterDAO {

    private static final Logger logger = LoggerFactory.getLogger(ExporterDAOImpl.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private InventoryLogsService inventoryLogsService;

    @Autowired
    private OrderDAO orderDAO;

    @Autowired
    private OrderDetailDAO orderDetailDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private DriverDAO driverDAO;

    @Override
    public List<ExporterDTO> getAllExportRequests() {
        List<Order> orders = orderDAO.getOrdersByStatusID(1); // Chỉ lấy các đơn hàng ở trạng thái Pending
        List<ExporterDTO> result = new ArrayList<>();
        for (Order order : orders) {
            result.add(convertToExporterDTO(orderService.getOrderById(order.getOrderID())));
        }
        logger.info("Fetched {} export requests (Pending)", result.size());
        return result;
    }

    @Override
    public ExporterDTO getExportRequestById(int orderId) {
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
        // Validate order existence
        OrderDTO orderDTO = exporterDTO.getOrderID() != null ? orderService.getOrderById(exporterDTO.getOrderID()) : null;
        if (orderDTO == null) {
            logger.error("Order not found for ID: {}", exporterDTO.getOrderID());
            throw new RuntimeException("Không tìm thấy đơn hàng với ID: " + exporterDTO.getOrderID());
        }
        if (orderDTO.getStatusID() == 5) {
            logger.warn("Attempt to create export request for canceled order ID: {}", exporterDTO.getOrderID());
            throw new RuntimeException("Đơn hàng với ID: " + exporterDTO.getOrderID() + " đã bị hủy");
        }

        // Validate orderDetails
        if (orderDetails == null || orderDetails.isEmpty()) {
            logger.error("Order details are null or empty for order ID: {}", exporterDTO.getOrderID());
            throw new RuntimeException("Chi tiết đơn hàng không được rỗng cho đơn hàng ID: " + exporterDTO.getOrderID());
        }

        // Check inventory availability
        for (OrderDetailDTO detail : orderDetails) {
            ProductDTO product = productService.getProductById(detail.getProductID());
            if (product == null) {
                logger.error("Product not found for ID: {}", detail.getProductID());
                throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + detail.getProductID());
            }
            if (product.getStatus() != 0) {
                logger.error("Product ID: {} is not active (Status: {})", detail.getProductID(), product.getStatus());
                throw new RuntimeException("Sản phẩm ID: " + detail.getProductID() + " không hoạt động (Status = " + product.getStatus() + ")");
            }
            if (!checkInventoryAvailability(detail.getProductID(), detail.getQuantity())) {
                logger.error("Insufficient inventory for product ID: {}. Requested: {}, Available: {}, Status: {}",
                        detail.getProductID(), detail.getQuantity(), product.getStockQuantity(), product.getStatus());
                throw new RuntimeException("Không đủ tồn kho cho sản phẩm ID: " + detail.getProductID() +
                        ". Yêu cầu: " + detail.getQuantity() + ", Hiện có: " + product.getStockQuantity());
            }
        }

        // Fetch customer information
        User customer = userDAO.findById(exporterDTO.getCustomerID());
        if (customer == null) {
            logger.error("Customer not found for ID: {}", exporterDTO.getCustomerID());
            throw new RuntimeException("Không tìm thấy thông tin khách hàng với ID: " + exporterDTO.getCustomerID());
        }
        logger.info("Customer fetched for order ID {}: {}", exporterDTO.getOrderID(), customer.getFullName());

        // Validate driverID if provided
        if (exporterDTO.getDriverID() != null) {
            Driver driver = driverDAO.findById(exporterDTO.getDriverID().longValue());
            if (driver == null) {
                logger.error("Invalid driver ID: {} - Driver does not exist", exporterDTO.getDriverID());
                throw new RuntimeException("DriverID không hợp lệ: " + exporterDTO.getDriverID() + " không tồn tại trong bảng Drivers");
            }
        }

        // Validate integer fields to prevent conversion errors
        try {
            if (exporterDTO.getCustomerID() != null && String.valueOf(exporterDTO.getCustomerID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid customerID: " + exporterDTO.getCustomerID());
            }
            if (exporterDTO.getStatusID() != null && String.valueOf(exporterDTO.getStatusID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid statusID: " + exporterDTO.getStatusID());
            }
            if (exporterDTO.getShippingMethodID() != null && String.valueOf(exporterDTO.getShippingMethodID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid shippingMethodID: " + exporterDTO.getShippingMethodID());
            }
            if (exporterDTO.getDriverID() != null && String.valueOf(exporterDTO.getDriverID()).matches(".*[^0-9].*")) {
                throw new NumberFormatException("Invalid driverID: " + exporterDTO.getDriverID());
            }
        } catch (NumberFormatException e) {
            logger.error("Invalid integer value in order data: {}", e.getMessage());
            throw new RuntimeException("Dữ liệu không hợp lệ cho các trường số: " + e.getMessage());
        }

        // Update existing order with provided information
        Order orderEntity = orderDAO.getOrderById(orderDTO.getOrderID());
        if (orderEntity != null) {
            orderEntity.setCustomerID(exporterDTO.getCustomerID() != null ? exporterDTO.getCustomerID() : orderDTO.getCustomerID());
            orderEntity.setOrderDate(exporterDTO.getOrderDate() != null ? exporterDTO.getOrderDate() : orderDTO.getOrderDate());
            orderEntity.setTotalAmount(exporterDTO.getTotalAmount() != null ? exporterDTO.getTotalAmount() : orderDTO.getTotalAmount());
            orderEntity.setDiscountAmount(exporterDTO.getDiscountAmount() != null ? exporterDTO.getDiscountAmount() : orderDTO.getDiscountAmount());
            orderEntity.setShippingAddress(exporterDTO.getShippingAddress() != null ? exporterDTO.getShippingAddress() : orderDTO.getShippingAddress());
            orderEntity.setStatusID(exporterDTO.getStatusID() != null ? exporterDTO.getStatusID() : orderDTO.getStatusID());
            orderEntity.setShippingMethodID(exporterDTO.getShippingMethodID() != null ? exporterDTO.getShippingMethodID() : orderDTO.getShippingMethodID());
            orderEntity.setShippingCost(exporterDTO.getShippingCost() != null ? exporterDTO.getShippingCost() : orderDTO.getShippingCost());
            orderEntity.setDistance(exporterDTO.getDistance() != null ? exporterDTO.getDistance() : orderDTO.getDistance());
            orderEntity.setDriverID(exporterDTO.getDriverID() != null ? exporterDTO.getDriverID() : orderDTO.getDriverID());
            orderEntity.setEstimatedDeliveryDate(exporterDTO.getEstimatedDeliveryDate() != null ? exporterDTO.getEstimatedDeliveryDate() : orderDTO.getEstimatedDeliveryDate());
            orderDAO.updateOrder(orderEntity);
            logger.info("Updated order ID: {}", orderDTO.getOrderID());
        } else {
            logger.error("Order entity not found for ID: {}", orderDTO.getOrderID());
            throw new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderDTO.getOrderID());
        }

        // Save or update order details
        List<OrderDetail> orderDetailsEntity = orderDetailService.getByOrderID(orderDTO.getOrderID());
        if (orderDetailsEntity == null || orderDetailsEntity.isEmpty()) {
            logger.error("No order details found for order ID: {}", orderDTO.getOrderID());
            throw new RuntimeException("Không tìm thấy chi tiết đơn hàng cho ID: " + orderDTO.getOrderID());
        }
        for (OrderDetailDTO detailDTO : orderDetails) {
            OrderDetail detail = new OrderDetail();
            detail.setOrderID(orderDTO.getOrderID());
            detail.setProductID(detailDTO.getProductID());
            detail.setQuantity(detailDTO.getQuantity());
            detail.setUnitPrice(detailDTO.getUnitPrice());
            detail.setStatus(detailDTO.getStatus() != 0 ? detailDTO.getStatus() : 1);
            orderDetailDAO.save(detail);
            logger.info("Saved order detail for order ID {}: product ID {}, quantity {}",
                    orderDTO.getOrderID(), detail.getProductID(), detail.getQuantity());
        }

        // Decrease product stock quantities
        for (OrderDetailDTO detail : orderDetails) {
            ProductDTO product = productService.getProductById(detail.getProductID());
            if (product != null) {
                if (product.getStatus() != 0) {
                    logger.error("Product ID: {} is not active (Status: {})", detail.getProductID(), product.getStatus());
                    throw new RuntimeException("Sản phẩm ID: " + detail.getProductID() + " không hoạt động (Status = " + product.getStatus() + ")");
                }
                int newStockQuantity = product.getStockQuantity() - detail.getQuantity();
                if (newStockQuantity < 0) {
                    logger.error("Insufficient stock after update for product ID: {}. Requested: {}, Available: {}, Status: {}",
                            detail.getProductID(), detail.getQuantity(), product.getStockQuantity(), product.getStatus());
                    throw new RuntimeException("Không đủ tồn kho để cập nhật cho sản phẩm ID: " + detail.getProductID() +
                            ". Yêu cầu: " + detail.getQuantity() + ", Hiện có: " + product.getStockQuantity());
                }
                product.setStockQuantity(newStockQuantity);
                productService.updateProduct(product);
                logger.info("Decreased stock quantity for product ID {} by {}: new stock {}",
                        detail.getProductID(), detail.getQuantity(), newStockQuantity);
            } else {
                logger.error("Product not found for ID: {}", detail.getProductID());
                throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + detail.getProductID());
            }
        }

        // Log inventory change
        for (OrderDetailDTO detail : orderDetails) {
            InventoryLogsDTO log = new InventoryLogsDTO();
            log.setProductId(detail.getProductID());
            log.setUserId(exporterDTO.getCustomerID()); // Use customerID as userId for logging
            log.setQuantityChange(-detail.getQuantity());
            log.setReason("Tạo đơn xuất hàng cho đơn hàng ID: " + orderDTO.getOrderID());
            log.setCreatedAt(new Date());
            log.setStatus(1);
            inventoryLogsService.createOrder(log);
            logger.info("Inventory log created for product ID {} in order {}", detail.getProductID(), orderDTO.getOrderID());
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
            if (product.getStatus() != 0) {
                logger.error("Product ID: {} is not active (Status: {})", productId, product.getStatus());
                return false;
            }
            boolean available = product.getStockQuantity() >= quantity;
            logger.info("Inventory check for product ID {}: requested quantity {}, available quantity {}, status {}, available {}",
                    productId, quantity, product.getStockQuantity(), product.getStatus(), available);
            return available;
        } catch (RuntimeException e) {
            logger.error("Error checking inventory for product ID {}: {}", productId, e.getMessage());
            return false;
        }
    }

    @Override
    public void cancelExportRequest(int orderId, String cancelReason, int exporterId) {
        Order order = orderDAO.getOrderById(orderId);
        if (order == null) {
            logger.error("Order not found for cancellation: {}", orderId);
            throw new RuntimeException("Đơn hàng không tồn tại: " + orderId);
        }
        if (order.getStatusID() == 5) {
            logger.warn("Order already canceled: {}", orderId);
            throw new RuntimeException("Đơn hàng đã bị hủy trước đó: " + orderId);
        }

        User exporter = userDAO.findById(exporterId);
        if (exporter == null || exporter.getRoleID() != 5) {
            logger.error("Invalid exporter ID {}: not an Exporter role", exporterId);
            throw new RuntimeException("Người dùng không có quyền Exporter (RoleID = 5)");
        }

        order.setStatusID(5);
        order.setCancelReason(cancelReason);
        orderDAO.updateOrder(order);
        logger.info("Order {} canceled by exporter ID {}: {}", orderId, exporterId, cancelReason);

        InventoryLogsDTO log = new InventoryLogsDTO();
        log.setProductId(0);
        log.setUserId(exporterId);
        log.setQuantityChange(0);
        log.setReason("Exporter hủy đơn hàng " + orderId + ": " + cancelReason);
        log.setCreatedAt(new Date());
        log.setStatus(1);
        inventoryLogsService.createOrder(log);
        logger.info("Inventory log created for order cancellation: {}", orderId);
    }

    @Override
    public void confirmOrder(int orderId, int exporterId) {
        Order order = orderDAO.getOrderById(orderId);
        if (order == null) {
            logger.error("Order not found for confirmation: {}", orderId);
            throw new RuntimeException("Đơn hàng không tồn tại: " + orderId);
        }
        if (order.getStatusID() != 1) {
            logger.warn("Order not in Pending state: {}", orderId);
            throw new RuntimeException("Đơn hàng không ở trạng thái Pending: " + orderId);
        }

        User exporter = userDAO.findById(exporterId);
        if (exporter == null || exporter.getRoleID() != 5) {
            logger.error("Invalid exporter ID {}: not an Exporter role", exporterId);
            throw new RuntimeException("Người dùng không có quyền Exporter (RoleID = 5)");
        }

        List<OrderDetail> details = orderDetailDAO.findByOrderID(orderId);
        for (OrderDetail detail : details) {
            ProductDTO product = productService.getProductById(detail.getProductID());
            if (product == null) {
                logger.error("Product not found for ID: {} in order {}", detail.getProductID(), orderId);
                throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + detail.getProductID());
            }
            if (product.getStatus() != 0) {
                logger.error("Product ID: {} is not active (Status: {}) in order {}",
                        detail.getProductID(), product.getStatus(), orderId);
                throw new RuntimeException("Sản phẩm ID: " + detail.getProductID() +
                        " không hoạt động (Status = " + product.getStatus() + ")");
            }
            if (!checkInventoryAvailability(detail.getProductID(), detail.getQuantity())) {
                logger.error("Insufficient inventory for product ID: {} in order {}. Requested: {}, Available: {}, Status: {}",
                        detail.getProductID(), orderId, detail.getQuantity(), product.getStockQuantity(), product.getStatus());
                throw new RuntimeException("Không đủ tồn kho cho sản phẩm ID: " + detail.getProductID() +
                        ". Yêu cầu: " + detail.getQuantity() + ", Hiện có: " + product.getStockQuantity());
            }
        }

        orderService.decreaseProductQuantitiesByOrderId(orderId);
        order.setStatusID(2); // Move to Processing
        orderDAO.updateOrder(order);
        logger.info("Order {} confirmed by exporter ID {}", orderId, exporterId);

        for (OrderDetail detail : details) {
            InventoryLogsDTO log = new InventoryLogsDTO();
            log.setProductId(detail.getProductID());
            log.setUserId(exporterId);
            log.setQuantityChange(-detail.getQuantity());
            log.setReason("Xác nhận đơn hàng: " + orderId);
            log.setCreatedAt(new Date());
            log.setStatus(1);
            inventoryLogsService.createOrder(log);
            logger.info("Inventory log created for product ID {} in order {}", detail.getProductID(), orderId);
        }
    }

    @Override
    public void rejectOrder(int orderId, String rejectReason, int exporterId) {
        Order order = orderDAO.getOrderById(orderId);
        if (order == null) {
            logger.error("Order not found for rejection: {}", orderId);
            throw new RuntimeException("Đơn hàng không tồn tại: " + orderId);
        }
        if (order.getStatusID() != 1) {
            logger.warn("Order not in Pending state for rejection: {}", orderId);
            throw new RuntimeException("Đơn hàng không ở trạng thái Pending: " + orderId);
        }

        User exporter = userDAO.findById(exporterId);
        if (exporter == null || exporter.getRoleID() != 5) {
            logger.error("Invalid exporter ID {}: not an Exporter role", exporterId);
            throw new RuntimeException("Người dùng không có quyền Exporter (RoleID = 5)");
        }

        order.setStatusID(5);
        order.setCancelReason(rejectReason);
        orderDAO.updateOrder(order);
        logger.info("Order {} rejected by exporter ID {}: {}", orderId, exporterId, rejectReason);

        InventoryLogsDTO log = new InventoryLogsDTO();
        log.setProductId(0);
        log.setUserId(exporterId);
        log.setQuantityChange(0);
        log.setReason("Exporter từ chối đơn hàng " + orderId + ": " + rejectReason);
        log.setCreatedAt(new Date());
        log.setStatus(1);
        inventoryLogsService.createOrder(log);
        logger.info("Inventory log created for order rejection: {}", orderId);
    }

    @Override
    public List<InventoryLogsDTO> getExportHistory(int productId, int orderId) {
        List<InventoryLogsDTO> logs;
        if (orderId > 0) {
            logs = inventoryLogsService.getAllLogs().stream()
                    .filter(log -> log.getReason().contains("Xác nhận đơn hàng: " + orderId) ||
                            log.getReason().contains("Hủy đơn hàng: " + orderId) ||
                            log.getReason().contains("Từ chối đơn hàng: " + orderId))
                    .collect(Collectors.toList());
            logger.info("Fetched {} inventory logs for order ID {}", logs.size(), orderId);
        } else if (productId > 0) {
            logs = inventoryLogsService.getLogsByProductId(productId);
            logger.info("Fetched {} inventory logs for product ID {}", logs.size(), productId);
        } else {
            logs = inventoryLogsService.getAllLogs();
            logger.info("Fetched {} inventory logs (all)", logs.size());
        }
        return logs;
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
        exporterDTO.setDriverID(order.getDriverID());
        exporterDTO.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        if (order.getStatusID() == 5) {
            exporterDTO.setCancelReason(order.getCancelReason());
        }
        exporterDTO.setOrderDetails(detailInfos);
        logger.info("Converted OrderDTO to ExporterDTO for order ID {}", order.getOrderID());
        return exporterDTO;
    }
}