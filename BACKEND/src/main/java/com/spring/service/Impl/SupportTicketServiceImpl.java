package com.spring.service.Impl;

import com.spring.dao.SupportTicketDAO;
import com.spring.dto.SupportTicketDTO;
import com.spring.entity.SupportTicket;
import com.spring.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SupportTicketServiceImpl implements SupportTicketService {
    @Autowired
    private SupportTicketDAO ticketDAO;

    private SupportTicketDTO convertToDTO(SupportTicket ticket) {
        if (ticket == null) return null;
        return new SupportTicketDTO(
                ticket.getTicketId(),
                ticket.getUserId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private SupportTicket convertToEntity(SupportTicketDTO dto) {
        if (dto == null) return null;
        SupportTicket ticket = new SupportTicket();
        ticket.setTicketId(dto.getTicketId());
        ticket.setUserId(dto.getUserId());
        ticket.setSubject(dto.getSubject());
        ticket.setDescription(dto.getDescription());
        ticket.setStatus(dto.getStatus());
        ticket.setPriority(dto.getPriority());
        ticket.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : Timestamp.valueOf(LocalDateTime.now()));
        ticket.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : Timestamp.valueOf(LocalDateTime.now()));
        return ticket;
    }

    @Override
    public SupportTicketDTO createTicket(SupportTicketDTO ticketDTO) {
        if (ticketDTO.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        SupportTicket ticket = convertToEntity(ticketDTO);
        if (ticket == null) {
            throw new IllegalArgumentException("Invalid ticket data");
        }
        ticket.setStatus("Pending");
        ticket.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        ticketDAO.save(ticket);
        return convertToDTO(ticket);
    }

    @Override
    public SupportTicketDTO getTicketById(int id) {
        SupportTicket ticket = ticketDAO.findById(id);
        if (ticket == null) {
            throw new RuntimeException("Ticket not found with ID: " + id);
        }
        return convertToDTO(ticket);
    }

    @Override
    public List<SupportTicketDTO> getAllTickets() {
        List<SupportTicket> tickets = ticketDAO.getAllTickets();
        List<SupportTicketDTO> ticketDTOs = new ArrayList<>();
        for (SupportTicket ticket : tickets) {
            ticketDTOs.add(convertToDTO(ticket));
        }
        return ticketDTOs;
    }

    @Override
    public List<SupportTicketDTO> getTicketsByUserId(int userId) {
        if (userId <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        List<SupportTicket> tickets = ticketDAO.findByUserId(userId);
        List<SupportTicketDTO> ticketDTOs = new ArrayList<>();
        for (SupportTicket ticket : tickets) {
            ticketDTOs.add(convertToDTO(ticket));
        }
        return ticketDTOs;
    }

    @Override
    public SupportTicketDTO updateTicket(SupportTicketDTO ticketDTO) {
        SupportTicket ticket = ticketDAO.findById(ticketDTO.getTicketId());
        if (ticket == null) {
            throw new RuntimeException("Ticket not found with ID: " + ticketDTO.getTicketId());
        }
        ticket.setSubject(ticketDTO.getSubject());
        ticket.setDescription(ticketDTO.getDescription());
        ticket.setStatus(ticketDTO.getStatus());
        ticket.setPriority(ticketDTO.getPriority());
        ticket.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        ticketDAO.update(ticket);
        return convertToDTO(ticket);
    }

    @Override
    public void deleteTicket(int id) {
        SupportTicket ticket = ticketDAO.findById(id);
        if (ticket == null) {
            throw new RuntimeException("Ticket not found with ID: " + id);
        }
        ticketDAO.delete(id);
    }
}