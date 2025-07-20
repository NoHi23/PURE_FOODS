package com.spring.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Taxes")
public class Tax {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TaxID")
    private int taxID;

    @Column(name = "TaxName", nullable = false, length = 100)
    private String taxName;

    @Column(name = "TaxRate", nullable = false)
    private double taxRate;

    @Column(name = "Description")
    private String description;

    @Column(name = "EffectiveDate", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "Status")
    private int status;

    public Tax() {}

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
    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }
    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
}