package com.example.service;

import com.example.dto.HealthResponse;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.util.concurrent.*;

/**
 * Service for checking system health status.
 */
@Service
public class HealthService {

    private static final int DB_CHECK_TIMEOUT_SECONDS = 2;
    
    private final DataSource dataSource;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    public HealthService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Checks the health of system components.
     * 
     * @return HealthResponse with current status
     */
    public HealthResponse checkHealth() {
        String dbStatus = checkDatabaseHealth();
        String overallStatus = "UP".equals(dbStatus) ? "UP" : "DEGRADED";
        
        return new HealthResponse(overallStatus, dbStatus, Instant.now().toString());
    }

    /**
     * Checks database connectivity with timeout.
     * 
     * @return "UP" if database is accessible, "DOWN" otherwise
     */
    private String checkDatabaseHealth() {
        Future<String> future = executor.submit(() -> {
            try (Connection conn = dataSource.getConnection()) {
                return conn.isValid(1) ? "UP" : "DOWN";
            } catch (SQLException e) {
                return "DOWN";
            }
        });

        try {
            return future.get(DB_CHECK_TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } catch (TimeoutException | InterruptedException | ExecutionException e) {
            future.cancel(true);
            return "DOWN";
        }
    }
}
