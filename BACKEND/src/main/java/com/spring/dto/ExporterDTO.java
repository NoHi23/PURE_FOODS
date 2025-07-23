package com.spring.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ExporterDTO {

    private Long exporterId;
    private Long userId;
    private Long customerId;
    private String customerName;
    private String phone;
    private String email;
    private String shippingAddress;
    private Long driverId;
    private LocalDateTime orderDate;
    private LocalDateTime estimatedDeliveryDate;
    private String delayReason;
    private Integer statusId;
    private String cancelReason;
    private String returnReason;
    private String source;
    private Integer status;
    private List<ExporterDetailDTO> items;

    // Constructors
    public ExporterDTO() {}

    public ExporterDTO(Long exporterId, Long userId, Long customerId, String customerName, String phone, String email,
                       String shippingAddress, Long driverId, LocalDateTime orderDate, LocalDateTime estimatedDeliveryDate,
                       String delayReason, Integer statusId, String cancelReason, String returnReason,
                       String source, Integer status, List<ExporterDetailDTO> items) {
        this.exporterId = exporterId;
        this.userId = userId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.phone = phone;
        this.email = email;
        this.shippingAddress = shippingAddress;
        this.driverId = driverId;
        this.orderDate = orderDate;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.delayReason = delayReason;
        this.statusId = statusId;
        this.cancelReason = cancelReason;
        this.returnReason = returnReason;
        this.source = source;
        this.status = status;
        this.items = items;
    }

    // Getters and Setters
    public Long getExporterId() { return exporterId; }
    public void setExporterId(Long exporterId) { this.exporterId = exporterId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public Integer getStatusId() { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public List<ExporterDetailDTO> getItems() { return items; }
    public void setItems(List<ExporterDetailDTO> items) { this.items = items; }

    // Nested DTO for stock availability
    public static class StockAvailability {
        private boolean available;

        public StockAvailability(boolean available) {
            this.available = available;
        }

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
    }

    public static class ExporterDetailDTO {
        private Long exporterDetailId;
        private Long exporterId;
        private Long productId;
        private int quantity;
        private float unitPrice;
        private String imageUrl;
        private Integer status;

        // Constructors
        public ExporterDetailDTO() {}

        public ExporterDetailDTO(Long exporterDetailId, Long exporterId, Long productId, int quantity, float unitPrice, String imageUrl, Integer status) {
            this.exporterDetailId = exporterDetailId;
            this.exporterId = exporterId;
            this.productId = productId;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.imageUrl = imageUrl;
            this.status = status;
        }

        // Getters and Setters
        public Long getExporterDetailId() { return exporterDetailId; }
        public void setExporterDetailId(Long exporterDetailId) { this.exporterDetailId = exporterDetailId; }
        public Long getExporterId() { return exporterId; }
        public void setExporterId(Long exporterId) { this.exporterId = exporterId; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public float getUnitPrice() { return unitPrice; }
        public void setUnitPrice(float unitPrice) { this.unitPrice = unitPrice; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public Integer getStatus() { return status; }
        public void setStatus(Integer status) { this.status = status; }
    }
}