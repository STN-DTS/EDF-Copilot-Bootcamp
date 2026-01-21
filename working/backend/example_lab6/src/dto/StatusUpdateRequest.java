package com.edf.bootcamp.orders.dto;

import com.edf.bootcamp.orders.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for order status updates.
 * 
 * @param newStatus The target status (required)
 * @param reason    Cancellation reason (required when newStatus is CANCELLED)
 */
public record StatusUpdateRequest(
    @NotNull(message = "New status is required")
    OrderStatus newStatus,
    
    String reason
) {
    /**
     * Validates that cancellation requests include a reason.
     */
    public boolean isValid() {
        if (newStatus == OrderStatus.CANCELLED) {
            return reason != null && !reason.isBlank();
        }
        return true;
    }
}
