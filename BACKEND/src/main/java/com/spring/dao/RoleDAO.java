package com.spring.dao;

import com.spring.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleDAO extends JpaRepository<Role, Integer> {
}
