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

    // Getters and Setters
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getIsOrganic() { return isOrganic; }
    public void setIsOrganic(Boolean isOrganic) { this.isOrganic = isOrganic; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}