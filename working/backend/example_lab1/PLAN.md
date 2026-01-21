# Lab 1 Plan — Add Version Health Check Endpoint

## Context
- Domain: Order Management (see docs/shared/reference-materials/DOMAIN_CONTEXT.md)
- Relevant paths: `src/main/java/com/example/orders/controllers/`
- Existing pattern: PingController.java

## Goal
Add a `/api/version` endpoint that returns the application version from configuration.

## Files to Change

| File | Action | Description |
|------|--------|-------------|
| `src/main/resources/application.properties` | Modify | Add `app.version` property |
| `src/main/java/.../controllers/VersionController.java` | Create | New controller for version endpoint |
| `src/test/java/.../controllers/VersionControllerTest.java` | Create | Unit test for version endpoint |

## Steps

1. Add `app.version=1.0.0` to `application.properties`
2. Create `VersionController` with `@Value` injection for version
3. Add `GET /api/version` endpoint returning `{"version": "1.0.0"}`
4. Write unit test to verify endpoint response
5. Run `./mvnw test` to verify all tests pass
6. Verify no unrelated changes with `git diff --stat`

## Risks Identified

| Risk | Mitigation |
|------|------------|
| Hardcoding version | Use `@Value` to inject from properties |
| Version format inconsistency | Use semantic versioning (X.Y.Z) |
| Scope creep to other endpoints | Only touch files listed above |

## Tests to Add

- `VersionControllerTest.shouldReturnVersionFromProperties()`
- Verify response status is 200
- Verify response body contains version field

## Acceptance Criteria

- [ ] Endpoint returns 200 with JSON body
- [ ] Version is read from configuration, not hardcoded
- [ ] One test verifies the endpoint behavior
- [ ] No other files modified

---

**Status:** ✅ Plan approved — proceed with implementation
