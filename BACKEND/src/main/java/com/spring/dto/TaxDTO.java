package com.spring.dto;

public class TaxDTO {
    private int taxID;
    private String taxName;
    private double taxRate;
    private String description;
    private String effectiveDate;
    private int status;

    public TaxDTO() {}

    public TaxDTO(int taxID, String taxName, double taxRate, String description, String effectiveDate, int status) {
        this.taxID = taxID;
        this.taxName = taxName;
        this.taxRate = taxRate;
        this.description = description;
        this.effectiveDate = effectiveDate;
        this.status = status;
    }

    public int getTaxID() {
        return taxID;
    }
    public void setTaxID(int taxID) {
        this.taxID = taxID;
    }
    public String getTaxName() {
        return taxName;
    }
    public void setTaxName(String taxName) {
        this.taxName = taxName;
    }
    public double getTaxRate() {
        return taxRate;
    }
    public void setTaxRate(double taxRate) {
        this.taxRate = taxRate;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getEffectiveDate() {
        return effectiveDate;
    }
    public void setEffectiveDate(String effectiveDate) {
        this.effectiveDate = effectiveDate;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}