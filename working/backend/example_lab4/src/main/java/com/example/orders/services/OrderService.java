package com.example.orders.services;

import com.example.orders.dto.OrderDetailsResponse;
import com.example.orders.exceptions.OrderNotFoundException;
import com.example.orders.exceptions.CustomerNotFoundException;
import com.example.orders.models.Customer;
import com.example.orders.models.Item;
import com.example.orders.models.Order;
import com.example.orders.repositories.CustomerRepository;
import com.example.orders.repositories.ItemRepository;
import com.example.orders.repositories.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

/**
 * Service for Order operations.
 * 
 * Refactored in Lab 4:
 * - Extracted error message constants
 * - Extracted findByIdOrThrow helper to reduce duplication
 */
@Service
public class OrderService {

    // === CONSTANTS (extracted in Lab 4 refactor) ===
    private static final String ORDER_NOT_FOUND_MSG = "Order not found: ";
    private static final String CUSTOMER_NOT_FOUND_MSG = "Customer not found: ";
    
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;

    public OrderService(
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * Returns order details including customer name and item list.
     *
     * @param orderId the order ID to look up
     * @return OrderDetailsResponse with full order information
     * @throws OrderNotFoundException if order does not exist
     * @throws CustomerNotFoundException if customer does not exist
     */
    public OrderDetailsResponse getOrderDetails(Long orderId) {
        // Using extracted helper method (Lab 4 refactor)
        Order order = findByIdOrThrow(
            orderRepository.findById(orderId),
            () -> new OrderNotFoundException(ORDER_NOT_FOUND_MSG + orderId)
        );

        Customer customer = findByIdOrThrow(
            customerRepository.findById(order.getCustomerId()),
            () -> new CustomerNotFoundException(CUSTOMER_NOT_FOUND_MSG + order.getCustomerId())
        );

        List<Item> items = itemRepository.findAllById(order.getItemIds());
        BigDecimal total = calculateTotal(items);

        return new OrderDetailsResponse(
            order.getId(),
            customer.getName(),
            items,
            order.getStatus(),
            total
        );
    }

    /**
     * Calculates the total price for a list of items.
     *
     * @param items the items to total
     * @return sum of all item prices, or ZERO if empty
     */
    BigDecimal calculateTotal(List<Item> items) {
        if (items == null || items.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return items.stream()
                .map(Item::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // === HELPER METHOD (extracted in Lab 4 refactor) ===
    
    /**
     * Extracts value from Optional or throws the supplied exception.
     * Reduces duplication of orElseThrow pattern.
     *
     * @param optional the Optional to unwrap
     * @param exceptionSupplier supplier for the exception to throw if empty
     * @return the unwrapped value
     * @param <T> the type of the value
     * @param <E> the type of the exception
     */
    private <T, E extends RuntimeException> T findByIdOrThrow(
            Optional<T> optional, 
            Supplier<E> exceptionSupplier) {
        return optional.orElseThrow(exceptionSupplier);
    }
}
