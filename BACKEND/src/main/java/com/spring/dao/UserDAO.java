package com.spring.dao;
import com.spring.entity.User;

import java.util.List;

public interface UserDAO {
    User addUser(User user);

    User findUserByEmail(String Email);

    List<User> getAllUsers();
    User getUserById(int id);
    User updateUser(User user);
    User deleteUser(int id);
    int countUsers();


}