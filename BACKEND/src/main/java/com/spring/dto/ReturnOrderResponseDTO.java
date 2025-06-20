package com.spring.dto;

import java.sql.Timestamp;

public class ReturnOrderResponseDTO {
    public Integer returnOrderId;
    public Integer orderId;
    public String customerName;
    public Timestamp returnDate;
    public String returnReason;
    public String statusName;
    public String processedByName;

    public ReturnOrderResponseDTO() {}
}