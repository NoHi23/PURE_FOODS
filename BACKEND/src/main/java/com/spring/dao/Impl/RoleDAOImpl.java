package com.spring.dao.Impl;

import com.spring.dao.RoleDAO;
import com.spring.entity.Products;
import com.spring.entity.Role;
import com.spring.entity.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoleDAOImpl implements RoleDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<Role> getAllRole() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from Role").list();
    }

    @Override
    public Role getRoleById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Role.class, id);
    }

    @Override
    public Role addRole(Role role) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(role);
        session.flush();
        return role;
    }

    @Override
    public Role updateRole(Role role) {
        Session session = sessionFactory.getCurrentSession();
        session.update(role);
        return role;
    }
}
