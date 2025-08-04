package com.spring.controller;

import com.spring.dto.SupportTicketDTO;
import com.spring.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support-tickets")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SupportTicketController {
    @Autowired
    private SupportTicketService ticketService;

    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@RequestBody SupportTicketDTO ticketDTO) {
        try {
            if (ticketDTO.getUserId() <= 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "User ID must be a positive number");
                errorResponse.put("status", 400);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            SupportTicketDTO createdTicket = ticketService.createTicket(ticketDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Ticket created successfully");
            response.put("ticket", createdTicket);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to create ticket: " + e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable int id) {
        try {
            SupportTicketDTO ticket = ticketService.getTicketById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("ticket", ticket);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Ticket not found: " + e.getMessage());
            errorResponse.put("status", 404);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTicketsByUserId(@PathVariable int userId) {
        try {
            List<SupportTicketDTO> tickets = ticketService.getTicketsByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("tickets", tickets);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to fetch tickets: " + e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTickets() {
        try {
            List<SupportTicketDTO> tickets = ticketService.getAllTickets();
            Map<String, Object> response = new HashMap<>();
            response.put("tickets", tickets);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to fetch tickets: " + e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTicket(@RequestBody SupportTicketDTO ticketDTO) {
        try {
            SupportTicketDTO updatedTicket = ticketService.updateTicket(ticketDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Ticket updated successfully");
            response.put("ticket", updatedTicket);
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update ticket: " + e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable int id) {
        try {
            ticketService.deleteTicket(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Ticket deleted successfully");
            response.put("status", 200);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to delete ticket: " + e.getMessage());
            errorResponse.put("status", 400);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}