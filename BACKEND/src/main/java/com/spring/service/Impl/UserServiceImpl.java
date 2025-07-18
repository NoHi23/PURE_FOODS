package com.spring.service.Impl;

import com.spring.common.EmailUtil;
import com.spring.dao.NotificationDAO;
import com.spring.dao.UserDAO;
import com.spring.dto.ProductDTO;
import com.spring.dto.UserDTO;
import com.spring.entity.Notifications;
import com.spring.entity.Products;
import com.spring.entity.User;
import com.spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private NotificationDAO notificationDAO;

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public boolean login(UserDTO userDTO) {
        try {
            User user = userDAO.findUserByEmail(userDTO.getEmail());
            if (user == null || !userDTO.getPassword().equals(user.getPassword())) {
                return false;
            }

            if (user.getLastLogin() == null) {
                Notifications first = new Notifications();
                first.setUserId(user.getUserId());
                first.setTitle("Chào mừng!");
                first.setContent("Bạn vừa đăng nhập lần đầu.");
                notificationDAO.save(first);
            }

            Timestamp loginTime = Timestamp.valueOf(LocalDateTime.now());
            user.setLastLogin(loginTime);
            userDAO.updateUser(user);

            userDTO.setLastLogin(loginTime);

            return true;
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
        user.setStatus(0);
        user.setTokenExpiry(null);
        user.setResetToken(null);
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
                user.getCreatedAt(),
                user.getResetToken(),
                user.getTokenExpiry()
        );
    }


    public UserDTO autoRegisterIfNotExists(String name, String email) {

        System.out.println(">> autoRegisterIfNotExists bắt đầu với name=" + name + ", email=" + email);

        User user = userDAO.findUserByEmail(email);
        boolean isNew = false;

        if (user == null) {
            isNew = true;

            user = new User();
            user.setFullName(name);
            user.setEmail(email);
            user.setPassword("123456");
            user.setRoleID(2);
            user.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
            user.setStatus(0);
            user.setTokenExpiry(null);
            user.setResetToken(null);
            userDAO.addUser(user);
            user = userDAO.findUserByEmail(email);

        }

        if (isNew || user.getLastLogin() == null) {
            Notifications first = new Notifications();
            first.setUserId(user.getUserId());
            first.setTitle("Chào mừng!");
            first.setContent("Bạn đã đăng nhập bằng Gmail lần đầu.");
            notificationDAO.save(first);
        }

        Timestamp loginTime = Timestamp.valueOf(LocalDateTime.now());
        user.setLastLogin(loginTime);
        userDAO.updateUser(user);
        return convertToDTO(user);
    }



    public UserDTO autoRegisterFacebookAccountIfNotExists(String name, String email) {

        User user = userDAO.findUserByEmail(email);
        boolean isNew = false;

        if (user == null) {
            isNew = true;

            user = new User();
            user.setFullName(name);
            user.setEmail(email);
            user.setPassword("facebook");
            user.setRoleID(2);
            user.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
            user.setStatus(0);
            user.setTokenExpiry(null);
            user.setResetToken(null);
            userDAO.addUser(user);
            user = userDAO.findUserByEmail(email);

        }

        if (isNew || user.getLastLogin() == null) {
            Notifications first = new Notifications();
            first.setUserId(user.getUserId());
            first.setTitle("Chào mừng!");
            first.setContent("Bạn đã đăng nhập bằng Facebook lần đầu.");
            notificationDAO.save(first);
        }

        Timestamp loginTime = Timestamp.valueOf(LocalDateTime.now());
        user.setLastLogin(loginTime);
        userDAO.updateUser(user);
        return convertToDTO(user);
    }


    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public UserDTO updateInfo(UserDTO userDTO) {
        User user = userDAO.getUserById(userDTO.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found!");
        }
        System.out.println("userDAO is null ? " + (userDAO == null ? " yes " : "no"));
        System.out.println("USER UPDATE: "+user);

        User existingUser = userDAO.findUserByEmail(userDTO.getEmail());
        if (existingUser != null && existingUser.getUserId() != user.getUserId()) {
            throw new RuntimeException("Email already exists!");
        }
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
//        user.setPassword(userDTO.getPassword());
        user.setPhone(userDTO.getPhone());
        user.setRoleID(userDTO.getRoleID());
        user.setStatus(userDTO.getStatus());
        user.setAddress(userDTO.getAddress());
        userDAO.updateUser(user);
        return convertToDTO(user);
    }

    @Override
    public UserDTO  deleteUser(int userID) {
        User user = userDAO.getUserById(userID);
        if (user == null) {
            throw new RuntimeException("User not found!");
        }
        user.setStatus(1);
        userDAO.updateUser(user);
        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> userList = userDAO.getAllUsers();
        if (userList == null) {
            throw new RuntimeException("User not found!");
        }
        List<UserDTO> userDTOList = new ArrayList<UserDTO>();
        for (User user : userList) {
            userDTOList.add(convertToDTO(user));
        }
        return userDTOList;
    }

    @Override
    public int getTotalUsers() {
        return userDAO.countUsers();
    }


    @Override
    public boolean sendResetPasswordEmail(String email) {
        User user = userDAO.findUserByEmail(email); // kiểm tra trong DB
        if (user == null) return false;

        String code = String.format("%06d", (int)(Math.random() * 1000000));
        Timestamp expiry = new Timestamp(System.currentTimeMillis() + (15 * 60 * 1000)); // 15 phút

        user.setResetToken(code);
        user.setTokenExpiry(expiry);
        userDAO.updateUser(user); // lưu lại token vào DB

        // Gửi email
        String subject = "Mã xác nhận đặt lại mật khẩu";
        String body = "<html><body>" +
                "<h2 style='color:#00b894;'>Yêu cầu đặt lại mật khẩu</h2>" +
                "<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>" +
                "<p>Vui lòng sử dụng mã xác nhận dưới đây để tiếp tục quá trình:</p>" +
                "<div style='padding:15px;background:#f0f0f0;font-size:24px;font-weight:bold;" +
                "text-align:center;border-radius:6px;margin:20px 0;color:#2d3436;'>" +
                code + "</div>" +
                "<p>Mã xác nhận này sẽ hết hạn sau <strong>15 phút</strong>.</p>" +
                "<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>" +
                "<div style='margin-top:30px;color:#777;font-size:14px;text-align:center'>" +
                "&copy; 2025 Hệ thống của bạn. Mọi quyền được bảo lưu.</div>" +
                "</body></html>";

        EmailUtil.sendEmail(email, subject, body);

        return true;
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        User user = userDAO.findByResetToken(token);
        if (user == null || user.getTokenExpiry().before(new Timestamp(System.currentTimeMillis()))) {
            return false; // Token không hợp lệ hoặc hết hạn
        }

        user.setPassword(newPassword); // nhớ hash password nếu có
        user.setResetToken(null);      // clear token
        user.setTokenExpiry(null);
        userDAO.updateUser(user);
        return true;
    }

    @Override
    public boolean verifyResetToken(String token) {
        User user = userDAO.findByResetToken(token);
        if (user == null || user.getTokenExpiry().before(new Timestamp(System.currentTimeMillis()))) {
            return false;
        }
        return true;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public UserDTO updateProfile(UserDTO userDTO) {
        User user = userDAO.getUserById(userDTO.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found!");
        }

        // Kiểm tra email có bị trùng không
        User existingUser = userDAO.findUserByEmail(userDTO.getEmail());
        if (existingUser != null && existingUser.getUserId() != user.getUserId()) {
            throw new RuntimeException("Email already exists!");
        }

        // Cập nhật thông tin KHÔNG đụng đến roleID và status
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setStatus(user.getStatus());

        userDAO.updateUser(user);
        return convertToDTO(user);
    }


    @Override
    public UserDTO addUser(UserDTO user) {
        User u = new User();
        u.setFullName(user.getFullName());
        u.setEmail(user.getEmail());
        u.setPassword(user.getPassword());
        u.setRoleID(user.getRoleID());
        u.setPhone(user.getPhone());
        u.setStatus(user.getStatus());
        u.setAddress(user.getAddress());
        user.setTokenExpiry(null);
        user.setResetToken(null);
        user.setCreatedAt(new java.sql.Timestamp(new Date().getTime()));
        userDAO.addUser(u);
        return convertToDTO(u);
    }

    @Override
    public boolean verifyPassword(int userId, String inputPassword) {
        User user = userDAO.getUserById(userId);
        if (user == null) return false;

        // Nếu dùng BCrypt, hãy dùng passwordEncoder.matches()
        return user.getPassword().equals(inputPassword); // So sánh mật khẩu thô
    }


}
