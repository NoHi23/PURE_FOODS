package com.spring.repository;

import com.spring.entity.InventoryLogs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryLogsRepository extends JpaRepository<InventoryLogs, Integer> {
}