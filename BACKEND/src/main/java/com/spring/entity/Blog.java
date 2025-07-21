package com.spring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Blogs")
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BlogID")
    private int blogID;

    @Column(name = "Title", nullable = false, length = 255)
    private String title;

    @Column(name = "Content", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "UserID", nullable = false)
    private int userID;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "Status")
    private int status;

    public Blog() {}

    public int getBlogID() { return blogID; }
    public void setBlogID(int blogID) { this.blogID = blogID; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getUserID() { return userID; }
    public void setUserID(int userID) { this.userID = userID; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}