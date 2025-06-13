package com.spring.service.Impl;

import com.spring.dao.UserDAO;
import com.spring.dto.UserDTO;
import com.spring.entity.User;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDAO userDAO;

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public boolean login(UserDTO userDTO) {
        try {
            System.out.println("userDAO is null ? " + (userDAO == null ? " yes " : "no"));
            assert userDAO != null;
            User user = userDAO.findUserByEmail(userDTO.getEmail());
            System.out.println("LOG" + user.getEmail());
            return user != null && userDTO.getPassword().equals(user.getPassword());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public UserDTO findByEmail(String email) {
        UserDTO userDTO = new UserDTO();
        User user = userDAO.findUserByEmail(email);
        if (user == null) {
            throw new RuntimeException("user not found");
        }
        return convertToDTO(user);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public UserDTO register(String fullName, String email, String phone, String password, String address) {
        if (userDAO.findUserByEmail(email) != null) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(password);
        user.setRoleID(2);
        user.setPhone(phone);
        user.setAddress(address);
        user.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
        user.setStatus(1);
        userDAO.addUser(user);
        return convertToDTO(user);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPassword(),
                user.getRoleID(),
                user.getPhone(),
                user.getAddress(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }


    public UserDTO autoRegisterIfNotExists(String name, String email) {

        System.out.println(">> autoRegisterIfNotExists bắt đầu với name=" + name + ", email=" + email);

        User user = userDAO.findUserByEmail(email);
        if (user == null) {
            user = new User();
            user.setFullName(name);
            user.setEmail(email);
            user.setPassword("123456");
            user.setRoleID(2);
            user.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
            user.setStatus(1);
            userDAO.addUser(user);
            user = userDAO.findUserByEmail(email);

        }
        return convertToDTO(user);
    }



    public UserDTO autoRegisterFacebookAccountIfNotExists(String name, String email) {

        User user = userDAO.findUserByEmail(email);
        if (user == null) {
            user = new User();
            user.setFullName(name);
            user.setEmail(email);
            user.setPassword("facebook");
            user.setRoleID(2);
            user.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
            user.setStatus(1);
            userDAO.addUser(user);
            user = userDAO.findUserByEmail(email);

        }
        return convertToDTO(user);
    }


}
