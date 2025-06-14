package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ProductOrganicInfo")
public class ProductOrganicInfo {
    @Id
    @Column(name = "ProductID")
    private Integer productId;

    @ManyToOne
    @JoinColumn(name = "OrganicStatusID", referencedColumnName = "OrganicStatusID")
    private OrganicStatus organicStatus;

    @Column(name = "Status")
    private Integer status;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ProductID")
    private Products product;

    // Getters and Setters
    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }
    public OrganicStatus getOrganicStatus() { return organicStatus; }
    public void setOrganicStatus(OrganicStatus organicStatus) { this.organicStatus = organicStatus; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
}