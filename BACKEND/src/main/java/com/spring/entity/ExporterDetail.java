package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ExporterDetails")
public class ExporterDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ExporterDetailID")
    private Long exporterDetailId;

    @Column(name = "ExporterID", nullable = false)
    private Long exporterId;

    @Column(name = "ProductID", nullable = false)
    private Long productId;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Column(name = "UnitPrice", nullable = false)
    private float unitPrice;

    @Column(name = "ImageURL")
    private String imageUrl;

    @Column(name = "Status")
    private Integer status;

    public ExporterDetail() {}

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