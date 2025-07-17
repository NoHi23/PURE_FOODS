package com.spring.dto;

import com.spring.entity.Products;

public class BestSellingProductDTO {
    private Products product;
    private long totalQuantity;
    private double totalRevenue;

    public BestSellingProductDTO(Products product, long totalQuantity, double totalRevenue) {
        this.product = product;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
    }

    public Products getProduct() {
        return product;
    }
    public void setProduct(Products product) {
        this.product = product;
    }
    public long getTotalQuantity() {
        return totalQuantity;
    }
    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
    public double getTotalRevenue() {
        return totalRevenue;
    }
    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
