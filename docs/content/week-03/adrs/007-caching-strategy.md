# ADR-007: Caching Strategy

## Status
Accepted

## Date
2026-01-20

## Context

Performance requirements:
- Order list API: <500ms (p95)
- Order detail API: <200ms (p95)
- Item catalog: <100ms (p95)

Current performance (measured):
- Order list: ~800ms (database scan)
- Order detail: ~300ms (joins across tables)
- Item catalog: ~50ms (already fast)

Data characteristics:
- Item catalog: Changes infrequently (daily updates)
- Orders: Change frequently (status updates)
- Customer data: Changes rarely

Cache invalidation complexity:
- Item price changes affect open orders
- Order status changes must reflect immediately
- Customer profile changes are rare

Infrastructure:
- Running on Kubernetes with 3 backend replicas
- Redis available as shared service
- No existing caching layer

## Decision

We will implement a **two-tier caching strategy**:
1. **Application-level cache (Caffeine):** For frequently accessed, stable data
2. **Distributed cache (Redis):** For shared state across instances

## Options Considered

| Criterion | Caffeine Only | Redis Only | Two-Tier | No Cache |
|-----------|---------------|------------|----------|----------|
| Performance | ✅ Fastest | ⚠️ Fast | ✅ Optimal | ❌ Slow |
| Consistency | ⚠️ Per-instance | ✅ Shared | ✅ Configurable | ✅ Perfect |
| Complexity | ✅ Low | ⚠️ Medium | ⚠️ Medium | ✅ None |
| Infrastructure | ✅ None | ❌ Redis cluster | ⚠️ Redis | ✅ None |

### Option A: Caffeine Only

**Pros:**
- Zero infrastructure requirements
- Fastest reads (no network hop)
- Simple configuration

**Cons:**
- Each instance has separate cache
- Inconsistency between pods during updates
- Limited total cache size

### Option B: Redis Only

**Pros:**
- Consistent across all instances
- Centralized cache management
- Supports complex data structures

**Cons:**
- Network latency on every cache hit
- Single point of failure (if not clustered)
- Additional infrastructure to manage

### Option C: Two-Tier (Chosen)

**Pros:**
- Best of both worlds
- Caffeine for hot/stable data (zero latency)
- Redis for shared session/state
- Flexible invalidation per use case

**Cons:**
- More complex configuration
- Need to manage two cache systems
- Invalidation logic more complex

### Option D: No Cache

**Pros:**
- Simplest implementation
- Always consistent
- No cache invalidation issues

**Cons:**
- Cannot meet performance requirements
- Higher database load
- Poor user experience

## Consequences

### Positive
- Meets performance requirements
- Flexible caching per use case
- Caffeine for hot data (no network hop)
- Redis for shared session/state

### Negative
- Two cache systems to manage
- Invalidation logic more complex
- Need Redis infrastructure

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Stale data displayed | Medium | Medium | Short TTL, event-driven invalidation |
| Cache stampede | Low | High | Cache warming, jitter on TTL |
| Redis unavailable | Low | Medium | Fallback to database, circuit breaker |

## Implementation Notes

### Cache Configuration by Data Type

| Data Type | Cache Layer | TTL | Invalidation Strategy |
|-----------|-------------|-----|----------------------|
| Item catalog | Caffeine L1 | 1 hour | On item update event |
| Customer profile | Redis L2 | 15 min | On profile update |
| Order list | None | - | Always fresh (frequent changes) |
| Order detail | Caffeine L1 | 30 sec | On status change event |
| Session data | Redis L2 | 30 min | On logout |

### Spring Boot Configuration

```yaml
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=10000,expireAfterWrite=3600s
  
  data:
    redis:
      host: ${REDIS_HOST}
      port: 6379
      timeout: 2000ms
```

### Caffeine Configuration

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(Duration.ofHours(1))
            .recordStats());
        return cacheManager;
    }
}
```

### Cache Annotations

```java
@Service
public class ItemService {

    @Cacheable(value = "items", key = "#itemId")
    public Item getItem(String itemId) {
        return itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException(itemId));
    }

    @CacheEvict(value = "items", key = "#item.id")
    public Item updateItem(Item item) {
        return itemRepository.save(item);
    }

    @CacheEvict(value = "items", allEntries = true)
    public void refreshCatalog() {
        // Triggered by scheduled job
    }
}
```

### Redis for Distributed Cache

```java
@Service
public class SessionService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void cacheSession(String sessionId, UserSession session) {
        redisTemplate.opsForValue().set(
            "session:" + sessionId,
            session,
            Duration.ofMinutes(30)
        );
    }

    public Optional<UserSession> getSession(String sessionId) {
        return Optional.ofNullable(
            (UserSession) redisTemplate.opsForValue().get("session:" + sessionId)
        );
    }
}
```

### Cache Metrics

Monitor cache effectiveness:

```java
@Scheduled(fixedRate = 60000)
public void reportCacheStats() {
    CaffeineCacheManager cacheManager = (CaffeineCacheManager) this.cacheManager;
    cacheManager.getCacheNames().forEach(name -> {
        Cache cache = cacheManager.getCache(name);
        CacheStats stats = cache.stats();
        log.info("Cache {} - hitRate: {}, missRate: {}, size: {}",
            name, stats.hitRate(), stats.missRate(), cache.estimatedSize());
    });
}
```

## References

- [Caffeine GitHub](https://github.com/ben-manes/caffeine)
- [Spring Cache Abstraction](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache)
- [Redis Documentation](https://redis.io/docs/)
- Internal: Caching Best Practices (Confluence)
