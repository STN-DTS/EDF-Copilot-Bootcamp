package com.example.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for Order data.
 * Follows the Order Management domain model.
 */
public record OrderResponse(
    Long id,
    String customerName,
    List<ItemResponse> items,
    String status,
    BigDecimal total
) {
    /**
     * Nested DTO for order line items.
     */
    public record ItemResponse(
        Long id,
        String name,
        int quantity,
        BigDecimal price
    ) {}
}
