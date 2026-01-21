package com.edf.bootcamp.orders.controllers;

import com.edf.bootcamp.orders.exceptions.InvalidStatusTransitionException;
import com.edf.bootcamp.orders.model.Order;
import com.edf.bootcamp.orders.model.OrderStatus;
import com.edf.bootcamp.orders.services.OrderStatusService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for OrderStatusController.
 * 
 * Uses @WebMvcTest for lightweight controller testing with mocked service layer.
 */
@WebMvcTest(OrderStatusController.class)
@DisplayName("OrderStatusController")
class OrderStatusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderStatusService orderStatusService;

    @Nested
    @DisplayName("PUT /api/orders/{id}/status")
    class UpdateStatus {

        @Test
        @DisplayName("should return 200 with updated order on valid transition")
        void should_Return200_When_TransitionIsValid() throws Exception {
            // Arrange
            Order updatedOrder = new Order();
            updatedOrder.setId(1L);
            updatedOrder.setStatus(OrderStatus.CONFIRMED);
            
            when(orderStatusService.updateStatus(eq(1L), eq(OrderStatus.CONFIRMED), isNull()))
                .thenReturn(updatedOrder);

            String requestBody = """
                {
                    "newStatus": "CONFIRMED"
                }
                """;

            // Act & Assert
            mockMvc.perform(put("/api/orders/1/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
        }

        @Test
        @DisplayName("should return 400 Problem Details on invalid transition")
        void should_Return400_When_TransitionIsInvalid() throws Exception {
            // Arrange
            when(orderStatusService.updateStatus(eq(1L), eq(OrderStatus.DELIVERED), isNull()))
                .thenThrow(new InvalidStatusTransitionException(1L, OrderStatus.PENDING, OrderStatus.DELIVERED));

            String requestBody = """
                {
                    "newStatus": "DELIVERED"
                }
                """;

            // Act & Assert
            mockMvc.perform(put("/api/orders/1/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.type").exists())
                .andExpect(jsonPath("$.title").exists())
                .andExpect(jsonPath("$.detail").exists());
        }

        @Test
        @DisplayName("should return 404 when order not found")
        void should_Return404_When_OrderNotFound() throws Exception {
            // Arrange
            when(orderStatusService.updateStatus(eq(999L), any(), any()))
                .thenThrow(new EntityNotFoundException("Order not found: 999"));

            String requestBody = """
                {
                    "newStatus": "CONFIRMED"
                }
                """;

            // Act & Assert
            mockMvc.perform(put("/api/orders/999/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should return 400 when status is null")
        void should_Return400_When_StatusIsNull() throws Exception {
            // Arrange
            String requestBody = """
                {
                    "newStatus": null
                }
                """;

            // Act & Assert
            mockMvc.perform(put("/api/orders/1/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("should return 400 when cancellation reason is missing")
        void should_Return400_When_CancellationReasonMissing() throws Exception {
            // Arrange
            String requestBody = """
                {
                    "newStatus": "CANCELLED"
                }
                """;

            // Act & Assert
            mockMvc.perform(put("/api/orders/1/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.type").value("https://api.edf.com/problems/validation-error"))
                .andExpect(jsonPath("$.title").value("Validation Error"))
                .andExpect(jsonPath("$.detail").value("Cancellation reason is required when status is CANCELLED"));
        }

        @Test
        @DisplayName("should return 200 when cancellation includes reason")
        void should_Return200_When_CancellationIncludesReason() throws Exception {
            // Arrange
            Order cancelledOrder = new Order();
            cancelledOrder.setId(1L);
            cancelledOrder.setStatus(OrderStatus.CANCELLED);
            cancelledOrder.setCancellationReason("Customer request");
            
            when(orderStatusService.updateStatus(eq(1L), eq(OrderStatus.CANCELLED), eq("Customer request")))
                .thenReturn(cancelledOrder);

            String requestBody = """
                {
                    "newStatus": "CANCELLED",
                    "reason": "Customer request"
                }
                """;

            // Act & Assert
            mockMvc.perform(put("/api/orders/1/status")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"))
                .andExpect(jsonPath("$.cancellationReason").value("Customer request"));
        }
    }
}
