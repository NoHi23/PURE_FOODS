package com.spring.service;
import com.spring.dto.ProductDTO;
import com.spring.dto.UserDTO;

import java.util.List;

public interface UserService {
    public boolean login(UserDTO userDTO);

    UserDTO findByEmail(String email);

    UserDTO register(String name, String email, String phone, String password, String address);

    UserDTO autoRegisterIfNotExists(String name, String email);

    UserDTO autoRegisterFacebookAccountIfNotExists(String name, String email);

    UserDTO updateInfo(UserDTO userDTO);

    boolean deleteUser(int userID);

    List<UserDTO> getAllUsers();

    int getTotalUsers();

    boolean sendResetPasswordEmail(String email);
    boolean resetPassword(String token, String newPassword);
    boolean verifyResetToken(String token);

    UserDTO addUser(UserDTO user);


}
