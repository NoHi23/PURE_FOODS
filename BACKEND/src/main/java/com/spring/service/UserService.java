package com.spring.service;
import com.spring.dto.UserDTO;

public interface UserService {
    public boolean login(UserDTO userDTO);

    UserDTO findByEmail(String email);

    UserDTO register(String name, String email, String phone, String password, String address);



}
