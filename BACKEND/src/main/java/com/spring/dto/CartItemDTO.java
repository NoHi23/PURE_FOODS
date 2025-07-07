package com.spring.dto;

public class CartItemDTO {
    private Long cartItemID;
    private Long productID;
    private int quantity;
    private double price;
    private String productName;
    private String image;
    private double total;

    public CartItemDTO() {}

    public CartItemDTO(Long cartItemID, Long productID, int quantity, double price, String productName, String image, double total) {
        this.cartItemID = cartItemID;
        this.productID = productID;
        this.quantity = quantity;
        this.price = price;
        this.productName = productName;
        this.image = image;
        this.total = total;
    }

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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
