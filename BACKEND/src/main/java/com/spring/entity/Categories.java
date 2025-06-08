package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Categories", indexes = {@Index(name = "idx_category_name", columnList = "CategoryName")})
public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryId;

    @Column(name = "CategoryName", nullable = false)
    private String categoryName;

    @Column(name = "Description")
    private String description;

    @Column(name = "IsOrganic", columnDefinition = "BIT DEFAULT 0")
    private Boolean isOrganic;

    @Column(name = "Status")
    private Integer status;

}