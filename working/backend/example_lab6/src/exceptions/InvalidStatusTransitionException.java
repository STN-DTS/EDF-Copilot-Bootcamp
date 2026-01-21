package com.edf.bootcamp.orders.exceptions;

import com.edf.bootcamp.orders.model.OrderStatus;

/**
 * Exception thrown when an order status transition is not allowed.
 * 
 * <p>This exception should be mapped to HTTP 400 Bad Request with
 * Problem Details format in the global exception handler.</p>
 */
public class InvalidStatusTransitionException extends RuntimeException {
    
    private final OrderStatus currentStatus;
    private final OrderStatus requestedStatus;
    private final Long orderId;

    public InvalidStatusTransitionException(Long orderId, OrderStatus current, OrderStatus requested) {
        super(String.format(
            "Cannot transition order %d from %s to %s", 
            orderId, current, requested
        ));
        this.orderId = orderId;
        this.currentStatus = current;
        this.requestedStatus = requested;
    }

    public OrderStatus getCurrentStatus() {
        return currentStatus;
    }

    public OrderStatus getRequestedStatus() {
        return requestedStatus;
    }

    public Long getOrderId() {
        return orderId;
    }
}
