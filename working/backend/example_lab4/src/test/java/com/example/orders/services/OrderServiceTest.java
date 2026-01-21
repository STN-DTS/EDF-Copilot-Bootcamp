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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Tests for OrderService.
 * Includes test added in Lab 4 to verify error message format.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private CustomerRepository customerRepository;
    
    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private OrderService orderService;

    private Customer testCustomer;
    private List<Item> testItems;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer(1L, "Alice Johnson", "alice@example.com");
        
        testItems = Arrays.asList(
            new Item(1L, "Widget", new BigDecimal("9.99")),
            new Item(2L, "Gadget", new BigDecimal("14.99"))
        );
        
        testOrder = new Order(1L, testCustomer.getId(), Arrays.asList(1L, 2L), "pending");
    }

    @Test
    @DisplayName("Should return order with customer name and item list")
    void shouldReturnOrderWithCustomerAndItems() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(Arrays.asList(1L, 2L))).thenReturn(testItems);

        OrderDetailsResponse result = orderService.getOrderDetails(1L);

        assertThat(result.customerName()).isEqualTo("Alice Johnson");
        assertThat(result.items()).hasSize(2);
    }

    @Test
    @DisplayName("Should throw OrderNotFoundException when order not found")
    void shouldReturn404WhenOrderNotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderDetails(999L))
                .isInstanceOf(OrderNotFoundException.class);
    }

    @Test
    @DisplayName("Should calculate total from item prices")
    void shouldCalculateTotalFromItemPrices() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(Arrays.asList(1L, 2L))).thenReturn(testItems);

        OrderDetailsResponse result = orderService.getOrderDetails(1L);

        // 9.99 + 14.99 = 24.98
        assertThat(result.total()).isEqualByComparingTo(new BigDecimal("24.98"));
    }

    @Test
    @DisplayName("Should return zero total for order with no items")
    void shouldReturnZeroTotalForOrderWithNoItems() {
        Order emptyOrder = new Order(2L, 1L, Collections.emptyList(), "pending");
        when(orderRepository.findById(2L)).thenReturn(Optional.of(emptyOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(Collections.emptyList())).thenReturn(Collections.emptyList());

        OrderDetailsResponse result = orderService.getOrderDetails(2L);

        assertThat(result.total()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Should calculate total for single item")
    void shouldCalculateTotalForSingleItem() {
        Order singleItemOrder = new Order(3L, 1L, List.of(1L), "pending");
        when(orderRepository.findById(3L)).thenReturn(Optional.of(singleItemOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(List.of(1L))).thenReturn(List.of(testItems.get(0)));

        OrderDetailsResponse result = orderService.getOrderDetails(3L);

        assertThat(result.total()).isEqualByComparingTo(new BigDecimal("9.99"));
    }

    // === NEW TEST ADDED IN LAB 4 REFACTOR ===
    
    @Test
    @DisplayName("Lab 4: Should throw with exact message format (verifies refactor didn't change behavior)")
    void shouldThrowWithExactMessageFormat() {
        when(orderRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderDetails(42L))
                .isInstanceOf(OrderNotFoundException.class)
                .hasMessage("Order not found: 42");
    }
}
