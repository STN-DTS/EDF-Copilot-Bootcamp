# Testing Instructions

## Testing Philosophy

- Write tests that provide value and confidence
- Test behavior, not implementation
- Keep tests simple and maintainable
- Write tests that serve as documentation

## Test Types

### Unit Tests

- Test individual functions/methods in isolation
- Mock external dependencies
- Focus on edge cases and error conditions
- Should be fast and deterministic

### Integration Tests

- Test interactions between components
- Use real dependencies where practical
- Test database operations with test database
- Verify API endpoints work correctly

### End-to-End Tests

- Test complete user workflows
- Use sparingly for critical paths
- Slower but provide high confidence
- Test across multiple systems

## Testing Guidelines

### Test Structure

Use AAA pattern:
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcome

### Naming Conventions

- Use descriptive test names
- Follow pattern: `should [expected behavior] when [condition]`
- Example: `should return 404 when user is not found`

### Best Practices

- One assertion per test (when practical)
- Test both happy and unhappy paths
- Keep tests independent and isolated
- Avoid test interdependencies
- Use meaningful test data
- Clean up after tests (database, files, etc.)

## Frontend Testing

### Component Testing

- Test user interactions
- Verify rendered output
- Test state changes
- Mock API calls
- Use React Testing Library or similar

```typescript
// Example
test('should display user name when loaded', async () => {
  render(<UserProfile userId="123" />);
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```


### Testing Tools

#### Frontend
- Vitest (test runner)
- React Testing Library (component tests)
- MSW (API mocking)
- Playwright or Cypress (E2E)

#### Backend
- JUnit 5 (test runner)
- Spring Boot Test (integration)
- Testcontainers (if Docker available)
- H2 (unit tests if Oracle unavailable)

## Working Folder PR Guidance

All test results and test code for labs must be submitted in `/working/frontend/{submitter_name}_{YYYYMMDD_HHMM}` or `/working/backend/{submitter_name}_{YYYYMMDD_HHMM}` as appropriate. Each PR must:
- Place new or changed files in a new timestamped folder
- Include a README describing the lab, submitter, and date
- Be ordered chronologically by folder name

## Backend Testing

### Service Testing

- Mock database and external services
- Test business logic thoroughly
- Verify error handling
- Test validation logic

### API Testing

- Test all endpoints
- Verify status codes
- Validate response structure
- Test authentication/authorization
- Test error responses

```typescript
// Example
describe('GET /api/users/:id', () => {
  it('should return user when id exists', async () => {
    const response = await request(app).get('/api/users/123');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', '123');
  });
});
```

### Testing Tools

- Jest, Vitest, or pytest for test runner
- Supertest or similar for API testing
- Test database (separate from development)
- Factory patterns for test data

## Test Coverage

- Aim for meaningful coverage, not 100%
- Focus on critical business logic
- Cover edge cases and error paths
- Use coverage reports to find gaps
- Don't sacrifice test quality for coverage numbers

## Mocking Guidelines

- Mock external dependencies (APIs, databases, file system)
- Keep mocks simple and maintainable
- Reset mocks between tests
- Use mock factories for complex objects
- Document why you're mocking

## Test Data

- Use factories or builders for test data
- Keep test data minimal but realistic
- Use meaningful names in test data
- Clean up test data after tests
- Don't rely on specific test data order

## Continuous Integration

- Run tests on every commit
- Run tests before merging
- Separate fast tests from slow tests
- Fail builds on test failures
- Monitor test execution time

## TDD Workflow (when applicable)

1. Write a failing test
2. Write minimal code to make it pass
3. Refactor while keeping tests green
4. Repeat

## Common Pitfalls to Avoid

- Testing implementation details
- Fragile tests that break with refactoring
- Tests that depend on external state
- Slow tests that hinder development
- Unclear test failures
- Not testing error conditions

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test path/to/test.spec.ts
```
