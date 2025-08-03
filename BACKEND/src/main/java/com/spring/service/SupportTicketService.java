package com.spring.service;

import com.spring.dto.SupportTicketDTO;
import java.util.List;

public interface SupportTicketService {
    SupportTicketDTO createTicket(SupportTicketDTO ticketDTO);
    SupportTicketDTO getTicketById(int id);
    List<SupportTicketDTO> getAllTickets();
    List<SupportTicketDTO> getTicketsByUserId(int userId);
    SupportTicketDTO updateTicket(SupportTicketDTO ticketDTO);
    void deleteTicket(int id);
}