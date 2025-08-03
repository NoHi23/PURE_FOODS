// SupportTicketDAO.java
package com.spring.dao;

import com.spring.entity.SupportTicket;
import java.util.List;

public interface SupportTicketDAO {
    void save(SupportTicket ticket);
    SupportTicket findById(int id);
    List<SupportTicket> getAllTickets();
    List<SupportTicket> findByUserId(int userId);
    void update(SupportTicket ticket);
    void delete(int id);
}