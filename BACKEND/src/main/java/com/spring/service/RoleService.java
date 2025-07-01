package com.spring.service;

import com.spring.dto.RoleDTO;
import com.spring.entity.Role;

import java.util.List;

public interface RoleService {
    List<RoleDTO> getAllRole();
    RoleDTO getRoleById(int id);
    RoleDTO deleteRole(int roleID);
    RoleDTO addRole(RoleDTO role);
    RoleDTO updateRole(RoleDTO roleDTO);

}
