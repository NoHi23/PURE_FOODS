package com.spring.dto;

import com.google.api.client.util.DateTime;

import java.util.Date;

public class SuppliersDTO {
    private int supplierId;
    private String supplierName;
    private String contactName;
    private String phone;
    private String email;
    private String address;
    private String organicCertification;
    private Date certificationExpiry;
    private java.sql.Timestamp createdAt;
    private int status;

    public SuppliersDTO() {}

    public SuppliersDTO(int supplierId, String supplierName, String contactName, String phone, String email, String address, String organicCertification, Date certificationExpiry, java.sql.Timestamp createdAt, int status) {
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.contactName = contactName;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.organicCertification = organicCertification;
        this.certificationExpiry = certificationExpiry;
        this.createdAt = createdAt;
        this.status = status;
        }
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
        public Date getCertificationExpiry() {
        return certificationExpiry;
        }
        public void setCertificationExpiry(Date certificationExpiry) {
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
