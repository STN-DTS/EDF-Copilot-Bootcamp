# Backend Development Instructions

## Technology Stack


## EDF Bootcamp Week 1 Backend Stack

- Runtime: Java 17 or 21
- Framework: Spring Boot 3.x
- Database: Oracle (XE for local/dev)
- ORM: Spring Data JPA
- Build Tool: Maven (with wrapper: `./mvnw`)
- Testing: JUnit 5 + Spring Boot Test + Testcontainers (if Docker available) or H2 for unit tests, shared dev Oracle for integration
- Health: Spring Actuator endpoints for liveness/readiness

## Oracle Test Strategy

**Default:** Use Testcontainers with Oracle XE if Docker is available. If not, use H2 for unit tests and a shared dev Oracle for integration tests. Document which is used in each test class.

## OpenShift Manifest Format

**Default:** Use raw YAML for Week 1. Place templates in `/k8s/` (e.g., `deployment.yaml`, `service.yaml`).

## Working Folder PR Guidance

All lab results must be submitted in `/working/backend/{submitter_name}_{YYYYMMDD_HHMM}`. Each PR must:
- Place new or changed files in a new timestamped folder
- Include a README describing the lab, submitter, and date
- Be ordered chronologically by folder name

---

## File Structure

```
/src
  /controllers
  /services
  /models
  /routes
  /middleware
  /utils
  /config
  /types
```

## Architecture Guidelines

### Layered Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data structures and database schemas
- **Middleware**: Handle cross-cutting concerns
- **Routes**: Define API endpoints

### Separation of Concerns

- Keep controllers thin - delegate to services
- Keep business logic in services
- Avoid business logic in models
- Use dependency injection where appropriate

## API Design

### RESTful Conventions

- Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Use plural nouns for resources (e.g., `/users`, `/products`)
- Use nested routes for relationships (e.g., `/users/:id/orders`)
- Version your API (e.g., `/api/v1/`)

### Request/Response

- Use consistent response formats
- Include appropriate status codes
- Validate request data
- Implement proper error responses

## Database

### Schema Design

- Normalize data appropriately
- Use foreign keys for relationships
- Index frequently queried fields
- Document schema decisions

### Queries

- Use parameterized queries to prevent SQL injection
- Optimize queries for performance
- Use transactions for multi-step operations
- Implement connection pooling

## Security

- Validate and sanitize all inputs
- Use environment variables for sensitive data
- Implement authentication and authorization
- Use HTTPS in production
- Implement rate limiting
- Set appropriate CORS policies
- Use security headers (helmet.js, etc.)

## Error Handling

- Use consistent error handling patterns
- Log errors appropriately
- Don't expose sensitive information in errors
- Use custom error classes
- Implement global error handler

## Testing

- Write unit tests for services
- Write integration tests for routes
- Mock external dependencies
- Test error scenarios
- Use test database for integration tests

## Performance

- Implement caching where appropriate
- Use async/await properly
- Optimize database queries
- Implement pagination for large datasets
- Monitor application performance

## Logging

- Use structured logging
- Log appropriate information (not sensitive data)
- Use different log levels appropriately
- Implement request logging middleware

## Best Practices

- Follow language-specific conventions
- Use TypeScript for type safety (if Node.js)
- Keep functions small and focused
- Document complex business logic
- Use environment-specific configurations
- Keep dependencies up to date
