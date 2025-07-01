package com.spring.entity;

import com.google.api.client.util.DateTime;
import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "Suppliers")
public class Suppliers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SupplierId")
    private int supplierId;

    @Column(name = "SupplierName", nullable = false, length = 100)
    private String supplierName;

    @Column(name = "ContactName", length = 100)
    private String contactName;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "Email", length = 100)
    private String email;

    @Column(name = "Address", length = 255)
    private String address;

    @Column(name = "OrganicCertification", length = 100)
    private String organicCertification;

    @Column(name = "CertificationExpiry")
    private LocalDate certificationExpiry;

    @Column(name = "CreatedAt")
    private java.sql.Timestamp createdAt;

    @Column(name = "Status")
    private int status;

    public Suppliers() {}

    public int getSupplierId() {
        return supplierId;
    }
    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }
    public String getSupplierName() {
        return supplierName;
    }
    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }
    public String getContactName() {
        return contactName;
    }
    public void setContactName(String contactName) {
        this.contactName = contactName;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getOrganicCertification() {
        return organicCertification;
    }
    public void setOrganicCertification(String organicCertification) {
        this.organicCertification = organicCertification;
    }
    public LocalDate getCertificationExpiry() {
        return certificationExpiry;
    }
    public void setCertificationExpiry(LocalDate certificationExpiry) {
        this.certificationExpiry = certificationExpiry;
    }
    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}
