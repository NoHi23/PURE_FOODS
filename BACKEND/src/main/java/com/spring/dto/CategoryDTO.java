package com.spring.dto;

public class CategoryDTO {
    private int categoryID;
    private String categoryName;
    private String categoryDescription;
    private int isOrganic;
    private int status;

    public CategoryDTO(){}

    public CategoryDTO(int categoryID, String categoryName, String categoryDescription, int isOrganic, int status) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        this.isOrganic = isOrganic;
        this.status = status;
    }
    public int getCategoryID() {
        return categoryID;
    }
    public void setCategoryID(int categoryID) {
        this.categoryID = categoryID;
    }
    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    public String getCategoryDescription() {
        return categoryDescription;
    }
    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }
    public int getIsOrganic() {
        return isOrganic;
    }
    public void setIsOrganic(int isOrganic) {
        this.isOrganic = isOrganic;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}
