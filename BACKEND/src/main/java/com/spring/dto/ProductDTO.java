    package com.spring.dto;

import jakarta.persistence.Column;
import java.util.Date;
import java.util.List;

    public class ProductDTO {
        private int productId;
        private String productName;
        private int categoryId;
        private int supplierId;
        private float price;
        private Float discountPercent;
        private Float salePrice;
        private int stockQuantity;
        private String description;
        private String imageURL;
        private List<String> galleryImages;
        private int lastUpdatedBy;
        private java.sql.Timestamp createdAt;
        private int status;
        private Date harvestDate;
        private Date expirationDate;
        private String nutritionalInfo;
        private String categoryName;
        private String supplierName;

        public ProductDTO() {
        }

        public ProductDTO(int productId, String productName) {
            this.productId = productId;
            this.productName = productName;
        }

        public ProductDTO(int productId, String productName, int categoryId, int supplierId, float price, Float discountPercent, Float salePrice, int stockQuantity, String description, String imageURL, int lastUpdatedBy, java.sql.Timestamp createdAt, int status) {
            this.productId = productId;
            this.productName = productName;
            this.categoryId = categoryId;
            this.supplierId = supplierId;
            this.price = price;
            this.discountPercent = discountPercent;
            this.salePrice = salePrice;
            this.stockQuantity = stockQuantity;
            this.description = description;
            this.imageURL = imageURL;
            this.lastUpdatedBy = lastUpdatedBy;
            this.createdAt = createdAt;
            this.status = status;
        }

        //thêm mới importer
        public Date getHarvestDate() {
            return harvestDate;
        }

        public void setHarvestDate(Date harvestDate) {
            this.harvestDate = harvestDate;
        }

        public Date getExpirationDate() {
            return expirationDate;
        }

        public void setExpirationDate(Date expirationDate) {
            this.expirationDate = expirationDate;
        }

        public String getNutritionalInfo() {
            return nutritionalInfo;
        }

        public void setNutritionalInfo(String nutritionalInfo) {
            this.nutritionalInfo = nutritionalInfo;
        }

        public int getProductId() {
            return productId;
        }

        public void setProductId(int productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public int getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(int categoryId) {
            this.categoryId = categoryId;
        }

        public int getSupplierId() {
            return supplierId;
        }

        public void setSupplierId(int supplierId) {
            this.supplierId = supplierId;
        }

        public float getPrice() {
            return price;
        }

        public void setPrice(float price) {
            this.price = price;
        }

        public int getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(int stockQuantity) {
            this.stockQuantity = stockQuantity;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getImageURL() {
            return imageURL;
        }

        public void setImageURL(String imageURL) {
            this.imageURL = imageURL;
        }

        public int getLastUpdatedBy() {
            return lastUpdatedBy;
        }

        public void setLastUpdatedBy(int lastUpdatedBy) {
            this.lastUpdatedBy = lastUpdatedBy;
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

        public Float getDiscountPercent() {
            return discountPercent;
        }

        public void setDiscountPercent(Float discountPercent) {
            this.discountPercent = discountPercent;
        }

        public Float getSalePrice() {
            return salePrice;
        }

        public void setSalePrice(Float salePrice) {
            this.salePrice = salePrice;
        }
        public List<String> getGalleryImages() {
            return galleryImages;
        }
        public void setGalleryImages(List<String> galleryImages) {
            this.galleryImages = galleryImages;
        }

        public String getCategoryName() {
            return categoryName;
        }
        public void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }
        public String getSupplierName() {
            return supplierName;
        }
        public void setSupplierName(String supplierName) {
            this.supplierName = supplierName;
        }
    }