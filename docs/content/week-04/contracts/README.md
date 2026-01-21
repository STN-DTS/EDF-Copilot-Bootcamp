# Contracts

**Status:** ✅ Complete

This folder contains API contracts for the Order Management System.

---

## Files

| File | Purpose | Status |
|------|---------|--------|
| [openapi.yaml](./openapi.yaml) | Main API contract v1 | ✅ Complete |

---

## Contract Overview

The OpenAPI 3.1 contract defines:

### Endpoints

| Resource | Operations |
|----------|------------|
| `/orders` | GET (list), POST (create) |
| `/orders/{id}` | GET (detail) |
| `/orders/{id}/cancel` | PUT (cancel) |
| `/customers/{id}` | GET (detail) |
| `/items` | GET (list) |
| `/items/{id}` | GET (detail) |

### Schemas

| Schema | Description |
|--------|-------------|
| `Order` | Order with items and totals |
| `OrderItem` | Line item within an order |
| `Customer` | Customer information |
| `Item` | Catalog item |
| `ProblemDetail` | RFC 7807 error response |

### Features

- **Authentication:** Bearer token (OAuth 2.0 / OIDC)
- **Pagination:** Page/size parameters with PageInfo response
- **Error Handling:** RFC 7807 Problem Details
- **Validation:** Field constraints and examples

---

## Contract Versioning

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| Major | 1.0.0 → 2.0.0 | Removing endpoints, renaming fields |
| Minor | 1.0.0 → 1.1.0 | Adding optional fields, new endpoints |
| Patch | 1.0.0 → 1.0.1 | Documentation fixes, typo corrections |

**Breaking Change Policy:**
- Major version changes require stakeholder approval
- Minor changes must be backwards compatible
- All changes must update the contract version

---

## Validation

Validate the contract before committing:

```bash
# Using Spectral
npx @stoplight/spectral-cli lint contracts/openapi.yaml

# Using Redocly
npx @redocly/cli lint contracts/openapi.yaml

# Using swagger-cli
npx swagger-cli validate contracts/openapi.yaml
```

---

## Mock Generation

Generate mock server from contract:

```bash
# Using Prism (recommended)
npx @stoplight/prism-cli mock contracts/openapi.yaml

# Mock server runs at http://localhost:4010
# Validates requests/responses against contract
```

---

## Code Generation

Generate TypeScript types:

```bash
# Using openapi-typescript
npx openapi-typescript contracts/openapi.yaml -o src/types/api.ts
```

Generate Java models:

```bash
# Using openapi-generator
npx @openapitools/openapi-generator-cli generate \
  -i contracts/openapi.yaml \
  -g spring \
  -o generated/
```

---

## Related Templates

| Template | Purpose |
|----------|---------|
| [DOMAIN_GLOSSARY.md](../templates/DOMAIN_GLOSSARY.md) | Canonical term definitions |
| [MOCK_STRATEGY.md](../templates/MOCK_STRATEGY.md) | MSW mock server setup |
| [TEST_STRATEGY.md](../templates/TEST_STRATEGY.md) | Contract testing approach |

---

## Copilot Assistance

```
Use P17 (OpenAPI Generation) to extend the contract:
"Generate OpenAPI schema for [new entity] following 
patterns in openapi.yaml"

Use P21 (Contract Validation) to check completeness:
"Review openapi.yaml for missing error cases, 
validation constraints, or documentation gaps"
```
