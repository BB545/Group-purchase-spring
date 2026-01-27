package com.hyunh.group_purchase.inventory.repository;

import com.hyunh.group_purchase.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}
