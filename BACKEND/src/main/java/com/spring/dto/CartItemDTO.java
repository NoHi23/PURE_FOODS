package com.spring.dto;

public class CartItemDTO {

    private Long cartItemID;
    private Long productID;
    private String productName;
    private String imageURL;
    private float priceAfterDiscount;
    private float originalPrice;
    private float discount;
    private int quantity;
    private float total;
    private String supplierName;
    private Long userID;


    // ✅ Constructors
    public CartItemDTO() {
    }

    public CartItemDTO(Long cartItemID, Long productID, String productName, String imageURL,
                       float priceAfterDiscount, float originalPrice, float discount,
                       int quantity, float total, String supplierName, Long userID) {
        this.cartItemID = cartItemID;
        this.productID = productID;
        this.productName = productName;
        this.imageURL = imageURL;
        this.priceAfterDiscount = priceAfterDiscount;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.quantity = quantity;
        this.total = total;
        this.supplierName = supplierName;
        this.userID = userID;
    }


    // ✅ Getters & Setters
    public Long getCartItemID() {
        return cartItemID;
    }

    public void setCartItemID(Long cartItemID) {
        this.cartItemID = cartItemID;
    }

    public Long getProductID() {
        return productID;
    }

    public void setProductID(Long productID) {
        this.productID = productID;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public float getPriceAfterDiscount() {
        return priceAfterDiscount;
    }

    public void setPriceAfterDiscount(float priceAfterDiscount) {
        this.priceAfterDiscount = priceAfterDiscount;
    }

    public float getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(float originalPrice) {
        this.originalPrice = originalPrice;
    }

    public float getDiscount() {
        return discount;
    }

    public void setDiscount(float discount) {
        this.discount = discount;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }


}
