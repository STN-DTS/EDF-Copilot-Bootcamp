package com.example.orders.services;

import com.example.orders.models.Order;
import com.example.orders.models.Customer;
import com.example.orders.models.Item;
import com.example.orders.repositories.OrderRepository;
import com.example.orders.repositories.CustomerRepository;
import com.example.orders.repositories.ItemRepository;
import com.example.orders.exceptions.OrderNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service for order operations.
 * 
 * Minimal implementation to pass tests (TDD approach).
 */
@Service
@Transactional(readOnly = true)
public class OrderService {

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
     * Get order details including customer name, items, and calculated total.
     * 
     * @param orderId the order ID
     * @return OrderDetails with customer, items, and total
     * @throws OrderNotFoundException if order not found
     */
    public OrderDetails getOrderDetails(Long orderId) {
        // AC2: Throw exception if not found
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException("Order not found: " + orderId));

        // AC1: Get customer name
        Customer customer = customerRepository.findById(order.getCustomerId())
            .orElseThrow(() -> new IllegalStateException("Customer not found for order"));

        // AC1: Get item list
        List<Item> items = itemRepository.findAllById(order.getItemIds());

        // AC3: Calculate total from item prices
        BigDecimal total = items.stream()
            .map(Item::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new OrderDetails(
            order.getId(),
            customer.getName(),
            items,
            order.getStatus(),
            total
        );
    }
}
