# ADR-005: Database Strategy

## Status
Accepted

## Date
2026-01-20

## Context

The Order Management System requires persistent storage for:
- Customer data (~100,000 customers)
- Order data (~1M orders, growing 50K/month)
- Item catalog (~10,000 items)

Our organization has existing expertise and infrastructure for:
- Oracle Database 19c (enterprise standard)
- PostgreSQL (newer projects)
- MongoDB (document store)

Requirements:
- ACID transactions for order processing
- Query performance <500ms for common operations
- Support for complex reporting queries
- 7-year data retention requirement (regulatory)

Constraints:
- Must run on OpenShift/Kubernetes
- Team has strong RDBMS experience
- Oracle licensing already paid for

## Decision

We will use **PostgreSQL 15** as the primary database.

## Options Considered

| Criterion | Oracle 19c | PostgreSQL 15 | MongoDB 7 |
|-----------|------------|---------------|-----------|
| ACID Transactions | ✅ Full | ✅ Full | ⚠️ Document-level |
| Kubernetes Support | ⚠️ Complex | ✅ Excellent | ✅ Good |
| Team Expertise | ✅ High | ✅ High | ⚠️ Limited |
| Licensing Cost | ❌ Expensive | ✅ Free | ⚠️ Enterprise $$ |
| JSON Support | ⚠️ Good | ✅ Excellent | ✅ Native |
| Migration Effort | ✅ None | ⚠️ Moderate | ❌ High |

### Option A: Oracle 19c

**Pros:**
- Existing enterprise license
- Team knows Oracle well
- Proven at scale

**Cons:**
- Complex Kubernetes deployment
- Expensive if we scale out
- Vendor lock-in on features

### Option B: PostgreSQL 15

**Pros:**
- Excellent Kubernetes operators available (Zalando, CrunchyData)
- No licensing cost
- Strong JSON support (JSONB)
- Team has experience from other projects
- Active community, good documentation

**Cons:**
- Need to migrate from Oracle (if existing data)
- Some Oracle-specific features not available

### Option C: MongoDB 7

**Pros:**
- Flexible schema
- Good Kubernetes support
- Native JSON

**Cons:**
- Team lacks MongoDB experience
- Multi-document transactions are complex
- Overkill for relational data model
- Would require significant design changes

## Consequences

### Positive
- Zero licensing cost for database
- Easier containerized deployment
- Better JSON support for API payloads
- Consistent with newer project standards

### Negative
- Need PostgreSQL training for DBA team
- Cannot use Oracle-specific features (if any exist)
- Migration effort from Oracle (if applicable)

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Performance issues at scale | Low | High | Load testing in Sprint 2 |
| DBA team unfamiliar | Medium | Medium | Training before Sprint 1 |
| Missing Oracle feature | Low | Low | Document required features first |

## Implementation Notes

1. **Sprint 0:** Set up PostgreSQL 15 on OpenShift using Zalando Postgres Operator
2. **Sprint 0:** Create database schema from entity models
3. **Sprint 1:** Load test with realistic data volumes (1M orders)
4. **Ongoing:** Use Liquibase for schema migrations

### Connection Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:5432/orderdb
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### Schema Migration Example

```sql
-- V001__create_orders_table.sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

## References

- [PostgreSQL 15 Release Notes](https://www.postgresql.org/docs/15/release-15.html)
- [Zalando Postgres Operator](https://github.com/zalando/postgres-operator)
- [Liquibase Documentation](https://docs.liquibase.com/)
- Internal: Database Selection Matrix (Confluence)
