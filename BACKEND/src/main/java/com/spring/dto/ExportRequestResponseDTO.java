package com.spring.dto;

public class ExportRequestResponseDTO {
    public String id;
    public String customerName;
    public Double amount;
    public String date;
    public String status;
    public CustomerDetails customerDetails;
    public Shipping shipping;
    public Driver driver;
    public String estimatedDeliveryDate; 

    public static class CustomerDetails {
        public String email;
        public String phone;
        public String address;
    }

    public static class Shipping {
        public String method;
        public String estimatedDelivery;
        public Double cost;
        public String distance;
    }

    public static class Driver {
        public String name;
        public String contact;
        public String vehicle;
    }
}