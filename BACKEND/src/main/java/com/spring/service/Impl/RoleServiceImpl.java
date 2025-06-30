package com.spring.service.Impl;

import com.spring.dao.RoleDAO;
import com.spring.dto.ProductDTO;
import com.spring.dto.RoleDTO;
import com.spring.dto.UserDTO;
import com.spring.entity.Products;
import com.spring.entity.Role;
import com.spring.entity.User;
import com.spring.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional(propagation = Propagation.REQUIRED)
public class RoleServiceImpl  implements RoleService {

    @Autowired
    private RoleDAO roleDAO;

    @Override
    public List<RoleDTO> getAllRole() {
        List<Role> roleList = roleDAO.getAllRole();
        if (roleList == null) {
            throw new RuntimeException("Role not found!");
        }
        List<RoleDTO> roleDTOList = new ArrayList<RoleDTO>();
        for (Role role : roleList) {
            roleDTOList.add(convertToDTO(role));
        }
        return roleDTOList;
    }

    @Override
    public RoleDTO getRoleById(int id) {
        Role role = roleDAO.getRoleById(id);
        if (role == null) {
            throw new RuntimeException("Không tìm thấy role");
        }
        return convertToDTO(role);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public RoleDTO deleteRole(int roleID) {
        Role role = roleDAO.getRoleById(roleID);
        if (role == null) {
            throw new RuntimeException("Role not found!");
        }
        return convertToDTO(role);
    }

    private RoleDTO convertToDTO(Role role) {
        return new RoleDTO(
                role.getRoleId(),
                role.getRoleName()
        );
    }

    @Override
    public RoleDTO addRole(RoleDTO role) {
        Role u = new Role();
        u.setRoleName(role.getRoleName());
        roleDAO.addRole(u);
        return convertToDTO(u);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    @Override
    public RoleDTO updateRole(RoleDTO roleDTO) {
        Role role = roleDAO.getRoleById(roleDTO.getRoleID());
        if (role == null) {
            throw new RuntimeException("Role not found!");
        }
        role.setRoleName(roleDTO.getRoleName());
        roleDAO.updateRole(role);
        return convertToDTO(role);
    }

}

