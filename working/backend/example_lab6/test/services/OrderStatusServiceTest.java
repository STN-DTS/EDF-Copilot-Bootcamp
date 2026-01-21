package com.edf.bootcamp.orders.services;

import com.edf.bootcamp.orders.exceptions.InvalidStatusTransitionException;
import com.edf.bootcamp.orders.model.Order;
import com.edf.bootcamp.orders.model.OrderStatus;
import com.edf.bootcamp.orders.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for OrderStatusService.
 * 
 * Tests the status transition state machine logic.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("OrderStatusService")
class OrderStatusServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderStatusService orderStatusService;

    private Order testOrder;

    @BeforeEach
    void setUp() {
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setStatus(OrderStatus.PENDING);
    }

    @Nested
    @DisplayName("updateStatus")
    class UpdateStatus {

        @Test
        @DisplayName("should transition from PENDING to CONFIRMED successfully")
        void should_TransitionToConfirmed_When_CurrentStatusIsPending() {
            // Arrange
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            // Act
            Order result = orderStatusService.updateStatus(1L, OrderStatus.CONFIRMED, null);

            // Assert
            assertThat(result.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
            verify(orderRepository).save(testOrder);
        }

        @Test
        @DisplayName("should transition from CONFIRMED to SHIPPED successfully")
        void should_TransitionToShipped_When_CurrentStatusIsConfirmed() {
            // Arrange
            testOrder.setStatus(OrderStatus.CONFIRMED);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            // Act
            Order result = orderStatusService.updateStatus(1L, OrderStatus.SHIPPED, null);

            // Assert
            assertThat(result.getStatus()).isEqualTo(OrderStatus.SHIPPED);
        }

        @Test
        @DisplayName("should transition from SHIPPED to DELIVERED successfully")
        void should_TransitionToDelivered_When_CurrentStatusIsShipped() {
            // Arrange
            testOrder.setStatus(OrderStatus.SHIPPED);
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            // Act
            Order result = orderStatusService.updateStatus(1L, OrderStatus.DELIVERED, null);

            // Assert
            assertThat(result.getStatus()).isEqualTo(OrderStatus.DELIVERED);
        }

        @Test
        @DisplayName("should allow CANCELLED from any non-terminal state")
        void should_TransitionToCancelled_When_StatusIsNotTerminal() {
            // Arrange
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

            // Act
            Order result = orderStatusService.updateStatus(1L, OrderStatus.CANCELLED, "Customer request");

            // Assert
            assertThat(result.getStatus()).isEqualTo(OrderStatus.CANCELLED);
            assertThat(result.getCancellationReason()).isEqualTo("Customer request");
        }

        @Test
        @DisplayName("should throw InvalidStatusTransitionException when skipping states")
        void should_ThrowException_When_SkippingStates() {
            // Arrange
            when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder));

            // Act & Assert
            assertThatThrownBy(() -> 
                orderStatusService.updateStatus(1L, OrderStatus.DELIVERED, null)
            )
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessageContaining("PENDING")
                .hasMessageContaining("DELIVERED");
        }

        @Test
        @DisplayName("should throw EntityNotFoundException when order not found")
        void should_ThrowException_When_OrderNotFound() {
            // Arrange
            when(orderRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> 
                orderStatusService.updateStatus(999L, OrderStatus.CONFIRMED, null)
            )
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("999");
        }
    }

    @Nested
    @DisplayName("isValidTransition")
    class IsValidTransition {

        @Test
        @DisplayName("should return true for valid forward transitions")
        void should_ReturnTrue_When_TransitionIsValid() {
            assertThat(orderStatusService.isValidTransition(OrderStatus.PENDING, OrderStatus.CONFIRMED)).isTrue();
            assertThat(orderStatusService.isValidTransition(OrderStatus.CONFIRMED, OrderStatus.SHIPPED)).isTrue();
            assertThat(orderStatusService.isValidTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED)).isTrue();
        }

        @Test
        @DisplayName("should return true for cancellation from any non-terminal state")
        void should_ReturnTrue_When_CancellingFromNonTerminal() {
            assertThat(orderStatusService.isValidTransition(OrderStatus.PENDING, OrderStatus.CANCELLED)).isTrue();
            assertThat(orderStatusService.isValidTransition(OrderStatus.CONFIRMED, OrderStatus.CANCELLED)).isTrue();
            assertThat(orderStatusService.isValidTransition(OrderStatus.SHIPPED, OrderStatus.CANCELLED)).isTrue();
        }

        @Test
        @DisplayName("should return false for transitions from terminal states")
        void should_ReturnFalse_When_TransitionFromTerminal() {
            assertThat(orderStatusService.isValidTransition(OrderStatus.DELIVERED, OrderStatus.CANCELLED)).isFalse();
            assertThat(orderStatusService.isValidTransition(OrderStatus.CANCELLED, OrderStatus.PENDING)).isFalse();
        }

        @Test
        @DisplayName("should return false for null inputs")
        void should_ReturnFalse_When_InputsAreNull() {
            assertThat(orderStatusService.isValidTransition(null, OrderStatus.CONFIRMED)).isFalse();
            assertThat(orderStatusService.isValidTransition(OrderStatus.PENDING, null)).isFalse();
        }
    }

    @Nested
    @DisplayName("getValidNextStatuses")
    class GetValidNextStatuses {

        @Test
        @DisplayName("should return CONFIRMED and CANCELLED for PENDING")
        void should_ReturnConfirmedAndCancelled_When_StatusIsPending() {
            Set<OrderStatus> result = orderStatusService.getValidNextStatuses(OrderStatus.PENDING);
            
            assertThat(result).containsExactlyInAnyOrder(
                OrderStatus.CONFIRMED, 
                OrderStatus.CANCELLED
            );
        }

        @Test
        @DisplayName("should return empty set for terminal states")
        void should_ReturnEmptySet_When_StatusIsTerminal() {
            assertThat(orderStatusService.getValidNextStatuses(OrderStatus.DELIVERED)).isEmpty();
            assertThat(orderStatusService.getValidNextStatuses(OrderStatus.CANCELLED)).isEmpty();
        }
    }
}
