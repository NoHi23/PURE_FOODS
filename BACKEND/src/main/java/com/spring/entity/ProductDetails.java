package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ProductDetails")
public class ProductDetails {
    @Id
    @Column(name = "ProductID")
    private Integer productId;

    @Column(name = "HarvestDate")
    private java.sql.Date harvestDate;

    @Column(name = "ExpirationDate")
    private java.sql.Date expirationDate;

    @Column(name = "NutritionalInfo")
    private String nutritionalInfo;

    @Column(name = "Status")
    private Integer status;

    @OneToOne
    @MapsId
    @JoinColumn(name = "ProductID")
    private Products product;

   
}