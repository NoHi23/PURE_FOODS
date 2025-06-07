package com.spring.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "OrganicStatus")
public class OrganicStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrganicStatusID")
    private Integer organicStatusId;

    @Column(name = "OrganicStatusName", nullable = false)
    private String organicStatusName;

    // Getters and Setters
    public Integer getOrganicStatusId() { return organicStatusId; }
    public void setOrganicStatusId(Integer organicStatusId) { this.organicStatusId = organicStatusId; }
    public String getOrganicStatusName() { return organicStatusName; }
    public void setOrganicStatusName(String organicStatusName) { this.organicStatusName = organicStatusName; }
}