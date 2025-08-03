package com.spring.dao.Impl;

import com.spring.dao.SupportTicketDAO;
import com.spring.entity.SupportTicket;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
@Transactional
public class SupportTicketDAOImpl implements SupportTicketDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(SupportTicket ticket) {
        entityManager.persist(ticket);
    }

    @Override
    public SupportTicket findById(int id) {
        return entityManager.find(SupportTicket.class, id);
    }

    @Override
    public List<SupportTicket> getAllTickets() {
        TypedQuery<SupportTicket> query = entityManager.createQuery(
                "SELECT t FROM SupportTicket t", SupportTicket.class);
        return query.getResultList();
    }

    @Override
    public List<SupportTicket> findByUserId(int userId) {
        TypedQuery<SupportTicket> query = entityManager.createQuery(
                "SELECT t FROM SupportTicket t WHERE t.userId = :userId", SupportTicket.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Override
    public void update(SupportTicket ticket) {
        entityManager.merge(ticket);
    }

    @Override
    public void delete(int id) {
        SupportTicket ticket = findById(id);
        if (ticket != null) {
            entityManager.remove(ticket);
        }
    }
}