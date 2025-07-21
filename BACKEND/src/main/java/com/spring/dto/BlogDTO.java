package com.spring.dto;

import java.time.LocalDateTime;

public class BlogDTO {
    private int blogID;
    private String title;
    private String content;
    private int userID;
    private LocalDateTime createdAt;
    private int status;

    public BlogDTO() {}

    public BlogDTO(int blogID, String title, String content, int userID, LocalDateTime createdAt, int status) {
        this.blogID = blogID;
        this.title = title;
        this.content = content;
        this.userID = userID;
        this.createdAt = createdAt;
        this.status = status;
    }

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
