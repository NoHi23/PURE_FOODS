package com.spring.dto;

import java.sql.Timestamp;

public class SupportTicketDTO {
    private int ticketId;
    private int userId;
    private String subject;
    private String description;
    private String status;
    private String priority;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructors
    public SupportTicketDTO() {}

    public SupportTicketDTO(int ticketId, int userId, String subject, String description,
                            String status, String priority, Timestamp createdAt, Timestamp updatedAt) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public int getTicketId() { return ticketId; }
    public void setTicketId(int ticketId) { this.ticketId = ticketId; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}