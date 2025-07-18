package com.spring.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class TraderProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int traderProductId;
    private int userId;
    private String productName;
    private double price;
    private int initialStockQuantity;
    private int currentStockQuantity;
    private String warehouseLocation;
    private int status; // 0: Chưa sẵn sàng, 1: Sẵn sàng
    @Column(updatable = false)
    private Date createdAt;
    private Date lastUpdated;

    // Constructors
    public TraderProducts() {}

    public TraderProducts(int traderProductId, int userId, String productName, double price, int initialStockQuantity,
                          int currentStockQuantity, String warehouseLocation, int status, Date createdAt, Date lastUpdated) {
        this.traderProductId = traderProductId;
        this.userId = userId;
        this.productName = productName;
        this.price = price;
        this.initialStockQuantity = initialStockQuantity;
        this.currentStockQuantity = currentStockQuantity;
        this.warehouseLocation = warehouseLocation;
        this.status = status;
        this.createdAt = createdAt;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public int getTraderProductId() { return traderProductId; }
    public void setTraderProductId(int traderProductId) { this.traderProductId = traderProductId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getInitialStockQuantity() { return initialStockQuantity; }
    public void setInitialStockQuantity(int initialStockQuantity) { this.initialStockQuantity = initialStockQuantity; }
    public int getCurrentStockQuantity() { return currentStockQuantity; }
    public void setCurrentStockQuantity(int currentStockQuantity) { this.currentStockQuantity = currentStockQuantity; }
    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public Date getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Date lastUpdated) { this.lastUpdated = lastUpdated; }
}