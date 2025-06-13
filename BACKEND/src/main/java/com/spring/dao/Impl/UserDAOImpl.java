package com.spring.dao.Impl;

import com.spring.dao.UserDAO;
import com.spring.entity.User;
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


}
