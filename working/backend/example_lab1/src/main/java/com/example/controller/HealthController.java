package com.example.controller;

import com.example.dto.HealthResponse;
import com.example.service.HealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health check endpoint for monitoring and load balancer probes.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    /**
     * Returns current system health status.
     * 
     * @return HealthResponse with status of system components
     */
    @GetMapping("/health")
    public ResponseEntity<HealthResponse> getHealth() {
        HealthResponse health = healthService.checkHealth();
        return ResponseEntity.ok(health);
    }
}
