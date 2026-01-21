package com.edf.bootcamp.orders.services;

import com.edf.bootcamp.orders.exceptions.InvalidStatusTransitionException;
import com.edf.bootcamp.orders.model.Order;
import com.edf.bootcamp.orders.model.OrderStatus;
import com.edf.bootcamp.orders.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;

/**
 * Service for managing order status transitions.
 * 
 * <p>Enforces the status state machine:
 * <pre>
 * PENDING → CONFIRMED, CANCELLED
 * CONFIRMED → SHIPPED, CANCELLED
 * SHIPPED → DELIVERED, CANCELLED
 * DELIVERED → (terminal)
 * CANCELLED → (terminal)
 * </pre>
 */
@Service
public class OrderStatusService {

    private final OrderRepository orderRepository;

    /**
     * Valid status transitions matrix.
     * Key = current status, Value = set of valid next statuses.
     */
    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = Map.of(
        OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
        OrderStatus.CONFIRMED, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
        OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED),
        OrderStatus.DELIVERED, Set.of(),  // Terminal state
        OrderStatus.CANCELLED, Set.of()   // Terminal state
    );

    public OrderStatusService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Updates the status of an order with transition validation.
     *
     * @param orderId   The order ID
     * @param newStatus The target status
     * @param reason    Optional reason (required for CANCELLED)
     * @return The updated order
     * @throws jakarta.persistence.EntityNotFoundException if order not found
     * @throws InvalidStatusTransitionException if transition not allowed
     */
    @Transactional
    public Order updateStatus(Long orderId, OrderStatus newStatus, String reason) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                "Order not found: " + orderId
            ));

        OrderStatus currentStatus = order.getStatus();
        
        if (!isValidTransition(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException(orderId, currentStatus, newStatus);
        }

        order.setStatus(newStatus);
        
        if (newStatus == OrderStatus.CANCELLED && reason != null) {
            order.setCancellationReason(reason);
        }

        return orderRepository.save(order);
    }

    /**
     * Checks if a status transition is valid.
     *
     * @param current   Current order status
     * @param requested Requested new status
     * @return true if transition is allowed
     */
    public boolean isValidTransition(OrderStatus current, OrderStatus requested) {
        if (current == null || requested == null) {
            return false;
        }
        
        Set<OrderStatus> validNextStates = VALID_TRANSITIONS.get(current);
        return validNextStates != null && validNextStates.contains(requested);
    }

    /**
     * Gets all valid next statuses for a given current status.
     *
     * @param current The current status
     * @return Set of valid next statuses (empty for terminal states)
     */
    public Set<OrderStatus> getValidNextStatuses(OrderStatus current) {
        return VALID_TRANSITIONS.getOrDefault(current, Set.of());
    }
}
