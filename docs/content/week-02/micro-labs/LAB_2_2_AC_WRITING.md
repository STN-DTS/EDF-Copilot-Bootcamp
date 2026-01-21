# Lab 2-2 — Acceptance Criteria Writing

## Goal

Convert a user journey into testable acceptance criteria using Given/When/Then (Gherkin) format. Learn to write criteria that are specific, measurable, and directly mappable to tests.

## Timebox

30 minutes

## Prerequisites

- Completed Lab 2-1 (or have a user journey to convert)
- Reviewed [Acceptance Criteria Template](../templates/ACCEPTANCE_CRITERIA.md)
- Attended Day 4 Training: Engineering-Readable AC

## Domain Context

Convert the **"Cancel Order"** journey from Lab 2-1 (or use the provided journey) into acceptance criteria.

---

## Task

### Step 1: Convert Happy Path to AC (10 min)

Write Gherkin acceptance criteria for the successful cancellation:

```gherkin
Feature: Cancel Order
  As a customer
  I want to cancel my pending orders
  So that I can receive a refund for items I no longer need

  Background:
    Given I am logged in as customer "CUST-001"
    And I have an order "ORD-12345" with status "Pending"
    And the order was created less than 24 hours ago

  Scenario: Successfully cancel a pending order
    Given I am viewing order "ORD-12345"
    When I click the "Cancel Order" button
    And I select "Changed my mind" as the cancellation reason
    And I confirm the cancellation
    Then the order status should be "Cancelled"
    And I should see "Order cancelled successfully"
    And a refund should be initiated
    And I should receive a cancellation confirmation email
```

### Step 2: Convert Failure Paths to AC (15 min)

Write at least 4 failure scenario ACs:

```gherkin
  Scenario: Cannot cancel a shipped order
    Given I am viewing order "ORD-67890"
    And the order status is "Shipped"
    When I try to cancel the order
    Then I should see error "This order has already been shipped and cannot be cancelled"
    And the order status should remain "Shipped"
    And the "Cancel Order" button should be disabled

  Scenario: Cannot cancel after 24-hour window
    Given I am viewing order "ORD-11111"
    And the order was created more than 24 hours ago
    When I try to cancel the order
    Then I should see error "Cancellation window has expired"
    And I should see a link to contact customer support

  Scenario: Cannot cancel another customer's order
    Given I am logged in as customer "CUST-001"
    And order "ORD-99999" belongs to customer "CUST-002"
    When I try to access order "ORD-99999"
    Then I should see error "You don't have permission to view this order"
    And the cancellation attempt should be logged for security review

  Scenario: System unavailable during cancellation
    Given I am viewing order "ORD-12345"
    And the order service is unavailable
    When I try to cancel the order
    Then I should see error "We're experiencing technical difficulties"
    And I should see a "Try Again" button
    And my cancellation request should not be processed
```

### Step 3: Validate Testability (5 min)

For each AC, verify it meets the SMART criteria:

| Criterion | Question | Your AC Passes? |
|-----------|----------|-----------------|
| **S**pecific | Is there only one interpretation? | ✓/✗ |
| **M**easurable | Can I write a test for this? | ✓/✗ |
| **A**chievable | Is this technically possible? | ✓/✗ |
| **R**elevant | Does this trace to a user need? | ✓/✗ |
| **T**ime-bound | Are timing requirements clear? | ✓/✗ |

### Step 4: Map to Test Types (Bonus)

| AC Scenario | Test Type | Owner | Framework |
|-------------|-----------|-------|-----------|
| Happy path cancellation | E2E Test | QA | Playwright |
| Validation errors | Unit Test | Dev | JUnit/Vitest |
| Status transitions | Integration Test | Dev | Spring Test |
| Email notification | Integration Test | Dev | Testcontainers |
| Permission check | Integration Test | Dev | Spring Security Test |

---

## Submission

### Folder Structure

```
/working/constraints/{your_name}_{YYYYMMDD_HHMM}/
├── README.md
├── AC_CANCEL_ORDER.md
└── TEST_MAPPING.md
```

### AC_CANCEL_ORDER.md Template

```gherkin
Feature: Cancel Order

  As a customer
  I want to cancel my pending orders
  So that I can receive a refund for items I no longer need

  # ===== HAPPY PATH =====

  Background:
    Given I am logged in as customer "<customerId>"
    And I have an order "<orderId>" with status "<status>"

  Scenario: Successfully cancel a pending order
    # Your scenario here

  # ===== FAILURE PATHS =====

  Scenario: Cannot cancel shipped order
    # Your scenario here

  Scenario: Cannot cancel after 24-hour window
    # Your scenario here

  Scenario: Cannot cancel another customer's order
    # Your scenario here

  Scenario: Handle system unavailability
    # Your scenario here

  # ===== EDGE CASES =====

  Scenario: Partial shipment cancellation
    # Your scenario here

  Scenario: Concurrent cancellation attempts
    # Your scenario here
```

---

## Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| ✅ Gherkin Format | All AC use Given/When/Then correctly |
| ✅ Happy Path | At least 1 complete happy path scenario |
| ✅ Failure Paths | At least 4 failure scenarios |
| ✅ Specific | No ambiguous terms ("fast", "good", "appropriate") |
| ✅ Testable | Each AC can be directly converted to a test |

---

## Anti-Patterns to Avoid

| ❌ Bad AC | ✅ Good AC |
|----------|-----------|
| "System should be fast" | "Response time should be <2 seconds" |
| "Error handling should be good" | "User sees error message with retry option" |
| "User can manage orders" | "User can view, cancel, and track orders" |
| "Then everything works" | "Then order status is 'Cancelled' and refund is initiated" |
| "Appropriate error message" | "Error message 'Order not found' with code 404" |

---

## Gherkin Best Practices

### Use Tags for Organization

```gherkin
@cancel-order @happy-path @smoke
Scenario: Successfully cancel a pending order
```

### Use Scenario Outlines for Variations

```gherkin
Scenario Outline: Cannot cancel non-cancellable orders
  Given I have an order with status "<status>"
  When I try to cancel the order
  Then I should see error "<error_message>"

  Examples:
    | status    | error_message                           |
    | Shipped   | This order has already been shipped     |
    | Delivered | This order has been delivered           |
    | Cancelled | This order is already cancelled         |
```

### Keep Steps Atomic

```gherkin
# ❌ Too many actions in one step
When I fill in the cancellation form and submit it and wait for confirmation

# ✅ Atomic steps
When I select "Changed my mind" as the reason
And I click "Confirm Cancellation"
Then I should see the confirmation message
```

---

## Reflection Questions

1. Which AC was hardest to make testable? Why?
2. Did writing AC reveal gaps in the original journey?
3. How would a QA engineer use these AC?

---

## Reference

- [Acceptance Criteria Template](../templates/ACCEPTANCE_CRITERIA.md)
- [Example: Cancel Order AC](../examples/ACCEPTANCE_CRITERIA_CANCEL_ORDER.md)
- [Week 2 Program](../WEEK_2_PROGRAM.md)
