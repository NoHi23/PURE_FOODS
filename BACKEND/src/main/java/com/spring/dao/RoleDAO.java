package com.spring.dao;

import com.spring.entity.Products;
import com.spring.entity.Role;
import com.spring.entity.User;

import java.util.List;

public interface RoleDAO {
    List<Role> getAllRole();
    Role getRoleById(int id);
    Role updateRole(Role role);
    Role addRole(Role role);

}
