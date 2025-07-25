package com.spring.dto;

public class OrderDetailDTO {
    private int orderDetailID;
    private int productID;
    private int orderID;
    private int quantity;
    private double unitPrice;
    private int status;

    public OrderDetailDTO(){};

    public OrderDetailDTO(int orderDetailID, int productID, int orderID, int quantity, double unitPrice,int status) {
        this.orderDetailID = orderDetailID;
        this.productID = productID;
        this.orderID = orderID;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.status = status;
    }
    public Integer getOrderDetailID() {
        return orderDetailID;
    }
    public void setOrderDetailID(Integer orderDetailID) {
        this.orderDetailID = orderDetailID;
    }
    public int getProductID() {
        return productID;
    }
    public void setProductID(int productID) {
        this.productID = productID;
    }
    public int getOrderID() {
        return orderID;
    }
    public void setOrderID(int orderID) {
        this.orderID = orderID;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    public double getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }
}