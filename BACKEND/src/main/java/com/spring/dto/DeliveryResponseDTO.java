package com.spring.dto;

import java.util.List;

public class DeliveryResponseDTO {
    public Integer orderId;
    public String customerName;
    public String customerPhone;
    public String customerAddress;
    public Double totalAmount;
    public String orderDate;
    public String status;
    public String shippingMethod;
    public Double shippingCost;
    public String estimatedDeliveryDate;
    public String driverName;
    public String driverPhone;
    public List<ProductInfo> products;

    public static class ProductInfo {
        public Integer productId;
        public String productName;
        public Integer quantity;
        public Double unitPrice;
    }
}