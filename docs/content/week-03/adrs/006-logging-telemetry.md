# ADR-006: Logging and Telemetry Strategy

## Status
Accepted

## Date
2026-01-20

## Context

The Order Management System requires:
- Structured logging for debugging and audit
- Distributed tracing across FE/BE services
- Metrics for monitoring and alerting
- Log aggregation for search and analysis

Organizational requirements:
- Logs shipped to central ELK stack
- Traces in Jaeger (organization standard)
- Metrics in Prometheus/Grafana

Regulatory:
- Audit logs retained for 7 years
- PII must not appear in logs

Team needs:
- Correlate requests across frontend and backend
- Debug production issues quickly
- Monitor SLOs (latency, error rate, throughput)

## Decision

We will implement the **OpenTelemetry** standard with the following stack:
- **Logging:** Structured JSON logs → Elasticsearch
- **Tracing:** OpenTelemetry → Jaeger
- **Metrics:** Micrometer → Prometheus → Grafana

## Options Considered

| Criterion | OpenTelemetry | Vendor-specific | Custom Implementation |
|-----------|---------------|-----------------|----------------------|
| Portability | ✅ Standard | ❌ Lock-in | ⚠️ None |
| Maturity | ✅ Production-ready | ✅ Mature | ❌ Unproven |
| Effort | ⚠️ Moderate | ✅ Low | ❌ High |
| Flexibility | ✅ High | ⚠️ Limited | ✅ High |
| Community | ✅ Large | ⚠️ Vendor | ❌ None |

### Option A: OpenTelemetry (Chosen)

**Pros:**
- Vendor-neutral, can switch backends without code changes
- Single API for traces, metrics, and logs
- Rich auto-instrumentation for Spring Boot and React
- Industry standard with excellent documentation
- CNCF project with strong community

**Cons:**
- Slightly more initial setup than vendor-specific
- Need to configure exporters for each backend
- Some SDK maturity varies by language

### Option B: Vendor-Specific (DataDog, New Relic)

**Pros:**
- Quick setup with minimal configuration
- Unified dashboard
- Enterprise support

**Cons:**
- Vendor lock-in
- Expensive at scale
- Requires contract negotiation

### Option C: Custom Implementation

**Pros:**
- Full control over format and destination
- No external dependencies

**Cons:**
- Significant development effort
- No community support
- Maintenance burden

## Consequences

### Positive
- Vendor-neutral, can switch backends without code changes
- Single API for traces/metrics/logs
- Rich auto-instrumentation
- Industry standard, good documentation
- Consistent tracing across FE and BE

### Negative
- Initial setup more complex than vendor SDK
- Need to configure exporters for each backend
- Team needs OpenTelemetry training

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Log volume overwhelms ELK | Medium | High | Sampling for non-error logs |
| PII in logs | Medium | High | PII scrubbing filter |
| Trace overhead impacts performance | Low | Medium | Sample traces at 10% in production |

## Implementation Notes

### Backend (Spring Boot)

Add dependencies:
```xml
<dependency>
    <groupId>io.opentelemetry.instrumentation</groupId>
    <artifactId>opentelemetry-spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Configuration:
```yaml
otel:
  exporter:
    otlp:
      endpoint: http://jaeger-collector:4317
  resource:
    attributes:
      service.name: order-service
      service.version: ${APP_VERSION}
      deployment.environment: ${ENV}

management:
  endpoints:
    web:
      exposure:
        include: health,prometheus
  metrics:
    tags:
      application: order-service
```

### Log Format

All logs must be structured JSON:

```json
{
  "timestamp": "2026-01-20T10:15:30.123Z",
  "level": "ERROR",
  "message": "Failed to create order",
  "traceId": "abc123-def456",
  "spanId": "xyz789",
  "service": "order-service",
  "orderId": "ORD-12345",
  "customerId": "[REDACTED]",
  "error": {
    "type": "ValidationException",
    "message": "Items list cannot be empty"
  }
}
```

### PII Scrubbing

Configure logback pattern to redact PII:

```xml
<encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
  <providers>
    <pattern>
      <pattern>
        {
          "customerId": "#asRegex(${customerId:-}){[^,]+}{[REDACTED]}",
          "email": "#asRegex(${email:-}){[^,]+}{[REDACTED]}"
        }
      </pattern>
    </pattern>
  </providers>
</encoder>
```

### Frontend (React)

```typescript
import { trace } from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const provider = new WebTracerProvider({
  resource: {
    'service.name': 'order-frontend',
    'service.version': import.meta.env.VITE_APP_VERSION,
  },
});

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new OTLPTraceExporter({ url: '/api/traces' })
  )
);

// Usage in components
const tracer = trace.getTracer('order-frontend');
const span = tracer.startSpan('create-order');
try {
  await createOrder(request);
  span.setStatus({ code: SpanStatusCode.OK });
} catch (error) {
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  throw error;
} finally {
  span.end();
}
```

### Key Metrics to Track

| Metric | Type | Description |
|--------|------|-------------|
| `http_server_requests_seconds` | Histogram | API latency |
| `orders_created_total` | Counter | Orders created |
| `orders_cancelled_total` | Counter | Orders cancelled |
| `db_query_duration_seconds` | Histogram | Database query time |
| `cache_hit_ratio` | Gauge | Cache effectiveness |

## References

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Spring Boot OTel Starter](https://github.com/open-telemetry/opentelemetry-java-instrumentation)
- [Micrometer Documentation](https://micrometer.io/docs)
- Internal: Observability Standards (Confluence)
