package com.example.service;

import com.example.dto.OrderResponse;
import com.example.dto.OrderResponse.ItemResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service for Order operations.
 * Currently returns stub data for vertical slice scaffold.
 */
@Service
public class OrderService {

    /**
     * Returns all orders (stub implementation with sample data).
     *
     * @return List of sample orders matching domain context
     */
    public List<OrderResponse> findAllOrders() {
        // Sample data from DOMAIN_CONTEXT.md
        return List.of(
            new OrderResponse(
                1L,
                "Alice",
                List.of(
                    new ItemResponse(101L, "Widget", 2, new BigDecimal("10.00")),
                    new ItemResponse(102L, "Gadget", 1, new BigDecimal("25.00"))
                ),
                "PENDING",
                new BigDecimal("45.00")
            ),
            new OrderResponse(
                2L,
                "Bob",
                List.of(
                    new ItemResponse(103L, "Sprocket", 5, new BigDecimal("5.00"))
                ),
                "COMPLETED",
                new BigDecimal("25.00")
            )
        );
    }
}
