# Week 4 Templates

**Status:** ✅ Complete

This folder contains templates for Week 4 Contract-First Development deliverables.

---

## Templates

| Template | Purpose | Status |
|----------|---------|--------|
| [DOMAIN_GLOSSARY.md](./DOMAIN_GLOSSARY.md) | Canonical term and entity definitions | ✅ Complete |
| [MOCK_STRATEGY.md](./MOCK_STRATEGY.md) | MSW mocking approach for frontend | ✅ Complete |
| [TEST_STRATEGY.md](./TEST_STRATEGY.md) | Test layer responsibilities and coverage | ✅ Complete |
| [SPRINT_PACKET_TEMPLATE.md](./SPRINT_PACKET_TEMPLATE.md) | Sprint scope definition template | ✅ Complete |

---

## Template Descriptions

### DOMAIN_GLOSSARY.md

Canonical definitions for all domain terms used across FE and BE:
- Entity definitions (Order, OrderItem, Customer, Item)
- Field specifications with types and constraints
- Enum definitions with allowed values and transitions
- Data type standards (Money, Date/Time, Identifiers)
- Naming conventions (camelCase for JSON, snake_case for DB)

### MOCK_STRATEGY.md

Frontend mocking strategy using Mock Service Worker (MSW):
- MSW setup and configuration
- Handler patterns for CRUD operations
- Mock data management and fixtures
- Error scenario simulation
- Vitest integration for testing
- Development toggle mechanisms

### TEST_STRATEGY.md

Test responsibilities across all layers:
- Test pyramid distribution (40% unit, 30% integration, 20% contract, 10% E2E)
- Layer-specific responsibilities (FE and BE)
- Coverage requirements (70% minimum)
- Contract testing with OpenAPI validation
- Accessibility and performance testing

### SPRINT_PACKET_TEMPLATE.md

Template for Sprint 1 scope definition:
- Sprint goal and Definition of Done
- In-scope and out-of-scope items
- Acceptance criteria in Given/When/Then format
- Technical requirements (security, logging, performance)
- Dependencies, risks, and ceremonies

---

## Contracts

The [../contracts/](../contracts/) folder contains the OpenAPI specification:
- [openapi.yaml](../contracts/openapi.yaml) — Complete API contract v1

---

## Usage

1. **Day 1:** Complete DOMAIN_GLOSSARY.md with team input
2. **Day 2:** Use glossary to create OpenAPI contract
3. **Day 3:** Complete MOCK_STRATEGY.md and TEST_STRATEGY.md
4. **Day 4:** Prepare SPRINT_PACKET_TEMPLATE.md for Sprint 1
5. **Day 5:** Review all artifacts and obtain sign-offs

---

## Copilot Assistance

```
Use these prompts with the templates:
- P17 to generate OpenAPI schemas from DOMAIN_GLOSSARY.md
- P21 to validate contract completeness
- P22 to generate MSW handlers from openapi.yaml

When filling templates:
- Include business context in entity descriptions
- Document all status transitions and business rules
- Add examples for complex fields
- Cross-reference related terms
```
