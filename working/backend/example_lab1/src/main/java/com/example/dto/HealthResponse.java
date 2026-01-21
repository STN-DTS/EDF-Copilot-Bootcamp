package com.example.dto;

/**
 * Response DTO for health check endpoint.
 * Contains status of system components without exposing sensitive details.
 */
public record HealthResponse(
    String status,
    String database,
    String timestamp
) {}
