package com.spring.dao;
import com.spring.entity.User;

public interface UserDAO {
    User addUser(User user);

    User findUserByEmail(String Email);
}