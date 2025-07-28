package com.spring.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ExporterDTO {
    private Integer orderID;
    private Integer customerID;
    private String customerName;
    private String customerEmail;
    private Date orderDate;
    private Double totalAmount;
    private Double discountAmount;
    private String shippingAddress;
    private Integer statusID;
    private String statusName; // Thêm để hiển thị tên trạng thái
    private Integer shippingMethodID;
    private Double shippingCost;
    private Double distance;
    private Integer driverID;
    private String cancelReason;
    private Date estimatedDeliveryDate;
    private String delayReason;
    private String returnReason;
    private String paymentMethod;
    private String paymentStatus;
    private List<OrderDetailInfo> orderDetails = new ArrayList<>();

    public ExporterDTO() {}

    public ExporterDTO(Integer orderID, Integer customerID, String customerName, String customerEmail, Date orderDate,
                       Double totalAmount, Double discountAmount, String shippingAddress, Integer statusID,
                       String statusName, Integer shippingMethodID, Double shippingCost, Double distance,
                       Integer driverID, String cancelReason, Date estimatedDeliveryDate, String delayReason,
                       String returnReason, String paymentMethod, String paymentStatus, List<OrderDetailInfo> orderDetails) {
        this.orderID = orderID;
        this.customerID = customerID;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.shippingAddress = shippingAddress;
        this.statusID = statusID;
        this.statusName = statusName;
        this.shippingMethodID = shippingMethodID;
        this.shippingCost = shippingCost;
        this.distance = distance;
        this.driverID = driverID;
        this.cancelReason = cancelReason;
        this.estimatedDeliveryDate = estimatedDeliveryDate;
        this.delayReason = delayReason;
        this.returnReason = returnReason;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.orderDetails = orderDetails != null ? orderDetails : new ArrayList<>();
    }

    public static class OrderDetailInfo {
        private Integer orderDetailID;
        private Integer productID;
        private String productName;
        private Integer quantity;
        private Double unitPrice;
        private Integer stockQuantity;
        private Integer status;

        public OrderDetailInfo() {}

        public OrderDetailInfo(Integer orderDetailID, Integer productID, String productName, Integer quantity,
                               Double unitPrice, Integer stockQuantity, Integer status) {
            this.orderDetailID = orderDetailID;
            this.productID = productID;
            this.productName = productName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.stockQuantity = stockQuantity;
            this.status = status;
        }

        public Integer getOrderDetailID() { return orderDetailID; }
        public void setOrderDetailID(Integer orderDetailID) { this.orderDetailID = orderDetailID; }
        public Integer getProductID() { return productID; }
        public void setProductID(Integer productID) { this.productID = productID; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public Double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
        public Integer getStockQuantity() { return stockQuantity; }
        public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
        public Integer getStatus() { return status; }
        public void setStatus(Integer status) { this.status = status; }
    }

    public Integer getOrderID() { return orderID; }
    public void setOrderID(Integer orderID) { this.orderID = orderID; }
    public Integer getCustomerID() { return customerID; }
    public void setCustomerID(Integer customerID) { this.customerID = customerID; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public Date getOrderDate() { return orderDate; }
    public void setOrderDate(Date orderDate) { this.orderDate = orderDate; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public Integer getStatusID() { return statusID; }
    public void setStatusID(Integer statusID) { this.statusID = statusID; }
    public String getStatusName() { return statusName; }
    public void setStatusName(String statusName) { this.statusName = statusName; }
    public Integer getShippingMethodID() { return shippingMethodID; }
    public void setShippingMethodID(Integer shippingMethodID) { this.shippingMethodID = shippingMethodID; }
    public Double getShippingCost() { return shippingCost; }
    public void setShippingCost(Double shippingCost) { this.shippingCost = shippingCost; }
    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
    public Integer getDriverID() { return driverID; }
    public void setDriverID(Integer driverID) { this.driverID = driverID; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Date getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(Date estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public String getReturnReason() { return returnReason; }
    public void setReturnReason(String returnReason) { this.returnReason = returnReason; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public List<OrderDetailInfo> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetailInfo> orderDetails) { this.orderDetails = orderDetails != null ? orderDetails : new ArrayList<>(); }
}