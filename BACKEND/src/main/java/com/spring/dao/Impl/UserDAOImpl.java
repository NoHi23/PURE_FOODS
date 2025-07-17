package com.spring.dao.Impl;

import com.spring.dao.UserDAO;
import com.spring.entity.Products;
import com.spring.entity.User;
import jakarta.persistence.NoResultException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class UserDAOImpl implements UserDAO {
    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public User addUser(User user) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(user);
        session.flush();
        return user;
    }


    @Override
    public User findUserByEmail(String Email) {
        Session session = sessionFactory.getCurrentSession();
        Query<User> query = session.createQuery("from User where email = :email", User.class);
        query.setParameter("email", Email);
        return query.uniqueResult();
    }


    @Override
    public List<User> getAllUsers() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from User").list();
    }

    @Override
    public User getUserById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(User.class, id);
    }


    @Override
    public User updateUser(User user) {
        Session session = sessionFactory.getCurrentSession();
        session.update(user);
        return user;
    }

    @Override
    public void deleteUser(int id) {
        Session session = sessionFactory.getCurrentSession();
        User user = session.get(User.class, id);
        session.delete(user);
    }

    @Override
    public int countUsers() {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("select count(*) from User");
        return ((Long) query.uniqueResult()).intValue();
    }

    @Override
    public User findByResetToken(String token) {
        Session session = sessionFactory.getCurrentSession();
        try {
            Query<User> query = session.createQuery("FROM User WHERE resetToken = :token", User.class);
            query.setParameter("token", token);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public List<User> findByRoleId(int roleID) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM User WHERE roleID = :roleID";
        return session.createQuery(hql, User.class)
                .setParameter("roleID", roleID)
                .getResultList();
    }

    public User findById(int id) {
        return sessionFactory.getCurrentSession().get(User.class, id);
    }
}
