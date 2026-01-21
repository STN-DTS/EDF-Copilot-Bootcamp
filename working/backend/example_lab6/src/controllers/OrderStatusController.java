package com.edf.bootcamp.orders.controllers;

import com.edf.bootcamp.orders.dto.StatusUpdateRequest;
import com.edf.bootcamp.orders.model.Order;
import com.edf.bootcamp.orders.model.OrderStatus;
import com.edf.bootcamp.orders.services.OrderStatusService;
import jakarta.validation.Valid;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Set;

/**
 * REST controller for order status operations.
 * 
 * <p>Endpoints:
 * <ul>
 *   <li>PUT /api/orders/{id}/status - Update order status</li>
 *   <li>GET /api/orders/{id}/status/next - Get valid next statuses</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/orders")
public class OrderStatusController {

    private final OrderStatusService orderStatusService;

    public OrderStatusController(OrderStatusService orderStatusService) {
        this.orderStatusService = orderStatusService;
    }

    /**
     * Updates the status of an order.
     *
     * @param id      The order ID
     * @param request The status update request
     * @return Updated order or Problem Details on error
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        
        // Validate cancellation reason requirement
        if (!request.isValid()) {
            ProblemDetail problem = ProblemDetail.forStatus(400);
            problem.setType(URI.create("https://api.edf.com/problems/validation-error"));
            problem.setTitle("Validation Error");
            problem.setDetail("Cancellation reason is required when status is CANCELLED");
            problem.setProperty("field", "reason");
            return ResponseEntity.badRequest().body(problem);
        }

        Order updatedOrder = orderStatusService.updateStatus(
            id, 
            request.newStatus(), 
            request.reason()
        );
        
        return ResponseEntity.ok(updatedOrder);
    }

    /**
     * Gets valid next statuses for an order.
     * 
     * <p>Useful for UI to show available status buttons.</p>
     *
     * @param id The order ID
     * @return Set of valid next statuses
     */
    @GetMapping("/{id}/status/next")
    public ResponseEntity<Set<OrderStatus>> getValidNextStatuses(@PathVariable Long id) {
        // In a real implementation, we'd fetch the order first
        // For demo, we'll return statuses for PENDING
        Set<OrderStatus> validNext = orderStatusService.getValidNextStatuses(OrderStatus.PENDING);
        return ResponseEntity.ok(validNext);
    }
}
