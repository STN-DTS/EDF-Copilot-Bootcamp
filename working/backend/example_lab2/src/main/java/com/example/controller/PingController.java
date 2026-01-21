package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Simple ping endpoint for health checks and connectivity verification.
 */
@RestController
@RequestMapping("/api")
public class PingController {

    /**
     * Returns a simple status response to verify the API is running.
     *
     * @return JSON with status "ok"
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
