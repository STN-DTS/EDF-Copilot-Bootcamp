package com.example.orders.services;

import com.example.orders.models.Order;
import com.example.orders.models.Customer;
import com.example.orders.models.Item;
import com.example.orders.repositories.OrderRepository;
import com.example.orders.repositories.CustomerRepository;
import com.example.orders.repositories.ItemRepository;
import com.example.orders.exceptions.OrderNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Tests for OrderService — written BEFORE implementation (TDD).
 * 
 * Acceptance Criteria:
 * 1. Given an order ID, return the order with customer name and item list
 * 2. Return 404 with Problem Details if order not found
 * 3. Order total should be calculated from item prices
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
        // Sample data from DOMAIN_CONTEXT.md
        testCustomer = new Customer(1L, "Alice Johnson", "alice@example.com");
        
        testItems = Arrays.asList(
            new Item(1L, "Widget", new BigDecimal("9.99")),
            new Item(2L, "Gadget", new BigDecimal("14.99"))
        );
        
        testOrder = new Order(1L, testCustomer.getId(), Arrays.asList(1L, 2L), "pending");
    }

    // ===========================================
    // Acceptance Criterion 1: Return order with customer and items
    // ===========================================
    
    @Test
    @DisplayName("AC1: Should return order with customer name and item list")
    void shouldReturnOrderWithCustomerAndItems() {
        // Given
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(Arrays.asList(1L, 2L))).thenReturn(testItems);

        // When
        OrderDetails result = orderService.getOrderDetails(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCustomerName()).isEqualTo("Alice Johnson");
        assertThat(result.getItems()).hasSize(2);
        assertThat(result.getItems().get(0).getName()).isEqualTo("Widget");
    }

    // ===========================================
    // Acceptance Criterion 2: Return 404 if order not found
    // ===========================================
    
    @Test
    @DisplayName("AC2: Should throw OrderNotFoundException when order not found")
    void shouldReturn404WhenOrderNotFound() {
        // Given
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> orderService.getOrderDetails(999L))
            .isInstanceOf(OrderNotFoundException.class)
            .hasMessageContaining("Order not found: 999");
    }

    // ===========================================
    // Acceptance Criterion 3: Calculate total from item prices
    // ===========================================
    
    @Test
    @DisplayName("AC3: Should calculate total from item prices")
    void shouldCalculateTotalFromItemPrices() {
        // Given
        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(Arrays.asList(1L, 2L))).thenReturn(testItems);

        // When
        OrderDetails result = orderService.getOrderDetails(1L);

        // Then
        // Widget (9.99) + Gadget (14.99) = 24.98
        assertThat(result.getTotal()).isEqualByComparingTo(new BigDecimal("24.98"));
    }

    // ===========================================
    // Edge Cases (Human-added)
    // ===========================================
    
    @Test
    @DisplayName("Edge: Order with no items should have total = 0")
    void shouldReturnZeroTotalForOrderWithNoItems() {
        // Given
        Order emptyOrder = new Order(2L, testCustomer.getId(), List.of(), "pending");
        when(orderRepository.findById(2L)).thenReturn(Optional.of(emptyOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(List.of())).thenReturn(List.of());

        // When
        OrderDetails result = orderService.getOrderDetails(2L);

        // Then
        assertThat(result.getTotal()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Edge: Order with single item")
    void shouldCalculateTotalForSingleItem() {
        // Given
        Order singleItemOrder = new Order(3L, testCustomer.getId(), List.of(1L), "pending");
        when(orderRepository.findById(3L)).thenReturn(Optional.of(singleItemOrder));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(itemRepository.findAllById(List.of(1L))).thenReturn(List.of(testItems.get(0)));

        // When
        OrderDetails result = orderService.getOrderDetails(3L);

        // Then
        assertThat(result.getTotal()).isEqualByComparingTo(new BigDecimal("9.99"));
    }
}
