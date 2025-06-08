package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Products", indexes = {
    @Index(name = "idx_product_name", columnList = "ProductName"),
    @Index(name = "idx_category_id", columnList = "CategoryID")
})
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductID")
    private Integer productId;

    @Column(name = "ProductName", nullable = false)
    private String productName;

    @ManyToOne
    @JoinColumn(name = "CategoryID", referencedColumnName = "CategoryID")
    private Categories category;

    @ManyToOne
    @JoinColumn(name = "SupplierID", referencedColumnName = "SupplierID")
    private Suppliers supplier;

    @Column(name = "Price", nullable = false)
    private Double price;

    @Column(name = "StockQuantity", nullable = false, columnDefinition = "INT CHECK (StockQuantity >= 0)")
    private Integer stockQuantity;

    @Column(name = "Description")
    private String description;

    @Column(name = "ImageURL")
    private String imageURL;

    @ManyToOne
    @JoinColumn(name = "LastUpdatedBy", referencedColumnName = "UserID")
    private User lastUpdatedBy;

    @Column(name = "CreatedAt", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT GETDATE()")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private Integer status;

   }