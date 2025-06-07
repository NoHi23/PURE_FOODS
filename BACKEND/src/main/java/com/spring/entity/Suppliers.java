package com.spring.entity;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "Suppliers", indexes = {@Index(name = "idx_supplier_name", columnList = "SupplierName")})
public class Suppliers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SupplierID")
    private Integer supplierId;

    @Column(name = "SupplierName", nullable = false)
    private String supplierName;

    @Column(name = "ContactName")
    private String contactName;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Email")
    private String email;

    @Column(name = "Address")
    private String address;

    @Column(name = "OrganicCertification")
    private String organicCertification;

    @Column(name = "CertificationExpiry")
    private Date certificationExpiry;

    @Column(name = "CreatedAt")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private Integer status;

    // Getters and Setters
    public Integer getSupplierId() { return supplierId; }
    public void setSupplierId(Integer supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getOrganicCertification() { return organicCertification; }
    public void setOrganicCertification(String organicCertification) { this.organicCertification = organicCertification; }
    public Date getCertificationExpiry() { return certificationExpiry; }
    public void setCertificationExpiry(Date certificationExpiry) { this.certificationExpiry = certificationExpiry; }
    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}