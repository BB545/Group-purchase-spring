package com.hyunh.group_purchase.inventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryRequest {
    private String productName;
    private int totalStock;
}
