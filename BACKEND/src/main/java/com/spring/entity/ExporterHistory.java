package com.spring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ExporterHistory")
public class ExporterHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HistoryID")
    private Long historyId;

    @Column(name = "ExporterID", nullable = false)
    private Long exporterId;

    @Column(name = "Action", nullable = false)
    private String action;

    @Column(name = "UserID")
    private Long userId;

    @Column(name = "ActionDate")
    private LocalDateTime actionDate;

    @Column(name = "Details")
    private String details;

    @Column(name = "Status")
    private Integer status;

    // Getters and Setters
    public Long getHistoryId() { return historyId; }
    public void setHistoryId(Long historyId) { this.historyId = historyId; }
    public Long getExporterId() { return exporterId; }
    public void setExporterId(Long exporterId) { this.exporterId = exporterId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDateTime getActionDate() { return actionDate; }
    public void setActionDate(LocalDateTime actionDate) { this.actionDate = actionDate; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}