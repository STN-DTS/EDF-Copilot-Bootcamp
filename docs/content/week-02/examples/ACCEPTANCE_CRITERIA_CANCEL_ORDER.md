# Acceptance Criteria: Cancel Order

**Feature:** Order Cancellation  
**User Story:** US-005  
**Journey:** J-003

---

```gherkin
Feature: Cancel Order
  As a customer
  I want to cancel my pending orders
  So that I can receive a refund for items I no longer need

  # ============================================================
  # HAPPY PATH SCENARIOS
  # ============================================================

  Background:
    Given I am logged in as customer "CUST-001"

  @happy-path @smoke @cancel-order
  Scenario: Successfully cancel a pending order
    Given I have an order "ORD-12345" with status "Pending"
    And the order was created less than 24 hours ago
    And the order total is "$59.98"
    When I navigate to order "ORD-12345"
    And I click the "Cancel Order" button
    And I select "Changed my mind" as the cancellation reason
    And I click "Confirm Cancellation"
    Then the order status should be "Cancelled"
    And I should see message "Order cancelled successfully"
    And a refund of "$59.98" should be initiated
    And I should receive a cancellation confirmation email

  @happy-path @cancel-order
  Scenario: Successfully cancel a confirmed order
    Given I have an order "ORD-12346" with status "Confirmed"
    And the order was created 12 hours ago
    When I navigate to order "ORD-12346"
    And I click the "Cancel Order" button
    And I select "Found better price elsewhere" as the cancellation reason
    And I click "Confirm Cancellation"
    Then the order status should be "Cancelled"
    And the cancellation reason should be "Found better price elsewhere"
    And I should see message "Order cancelled successfully"

  # ============================================================
  # FAILURE PATH SCENARIOS
  # ============================================================

  @failure @shipped
  Scenario: Cannot cancel a shipped order
    Given I have an order "ORD-67890" with status "Shipped"
    When I navigate to order "ORD-67890"
    Then the "Cancel Order" button should be disabled
    And I should see tooltip "This order has been shipped and cannot be cancelled"
    And I should see a "Contact Support" link

  @failure @shipped
  Scenario: Cannot cancel a delivered order
    Given I have an order "ORD-67891" with status "Delivered"
    When I navigate to order "ORD-67891"
    Then the "Cancel Order" button should not be visible
    And I should see "Return or Exchange" options instead

  @failure @time-window
  Scenario: Cannot cancel after 24-hour window expires
    Given I have an order "ORD-11111" with status "Pending"
    And the order was created 25 hours ago
    When I navigate to order "ORD-11111"
    Then the "Cancel Order" button should be disabled
    And I should see message "Cancellation window has expired"
    And I should see "Order can only be cancelled within 24 hours of placement"
    And I should see a "Contact Support" link

  @failure @authorization @security
  Scenario: Cannot cancel another customer's order
    Given order "ORD-99999" belongs to customer "CUST-002"
    When I try to navigate to order "ORD-99999"
    Then I should see error "You don't have permission to view this order"
    And I should be redirected to my orders list
    And a security event should be logged

  @failure @authorization @security
  Scenario: Cannot cancel order via direct API without authentication
    Given I am not logged in
    When I send a POST request to "/api/v1/orders/ORD-12345/cancel"
    Then the response status should be 401
    And the response should contain error "Authentication required"

  @failure @system-error
  Scenario: Handle system unavailability gracefully
    Given I have an order "ORD-12345" with status "Pending"
    And the order service is unavailable
    When I navigate to order "ORD-12345"
    And I click the "Cancel Order" button
    And I select "Changed my mind" as the cancellation reason
    And I click "Confirm Cancellation"
    Then I should see error "We're experiencing technical difficulties. Please try again later."
    And I should see a "Try Again" button
    And the order status should remain "Pending"

  @failure @validation
  Scenario: Cannot cancel without providing a reason
    Given I have an order "ORD-12345" with status "Pending"
    When I navigate to order "ORD-12345"
    And I click the "Cancel Order" button
    And I do not select a cancellation reason
    And I click "Confirm Cancellation"
    Then I should see validation error "Please select a cancellation reason"
    And the cancellation should not be processed

  # ============================================================
  # EDGE CASE SCENARIOS
  # ============================================================

  @edge-case @partial-shipment
  Scenario: Partial cancellation when some items are shipped
    Given I have an order "ORD-22222" with 3 items
    And item "Widget Pro" is "Shipped"
    And item "Gadget Plus" is "Pending"
    And item "Thingamajig" is "Pending"
    When I navigate to order "ORD-22222"
    And I click the "Cancel Order" button
    Then I should see only "Gadget Plus" and "Thingamajig" as cancellable
    And the cancellation subtotal should reflect only pending items
    When I confirm the partial cancellation
    Then items "Gadget Plus" and "Thingamajig" should be cancelled
    And item "Widget Pro" should remain "Shipped"
    And the refund should be for the pending items only

  @edge-case @discount
  Scenario: Cancellation refunds discounted amount
    Given I have an order "ORD-33333" with status "Pending"
    And the order had a 20% discount code applied
    And the original total was "$100.00"
    And the discounted total was "$80.00"
    When I cancel order "ORD-33333"
    Then the refund should be "$80.00"
    And the discount code should be marked as "used"
    And I should see message "Note: Discount code cannot be reused"

  @edge-case @concurrent
  Scenario: Handle concurrent cancellation attempts
    Given I have an order "ORD-12345" with status "Pending"
    And I am viewing the order in two browser tabs
    When I cancel the order in the first tab
    And the cancellation succeeds
    And I try to cancel the order in the second tab
    Then I should see error "Order status has changed. Please refresh."
    And I should see a "Refresh" button
    When I click "Refresh"
    Then I should see the order status is "Cancelled"

  @edge-case @timing
  Scenario: Cancellation at exactly 24-hour boundary
    Given I have an order "ORD-44444" with status "Pending"
    And the order was created exactly 23 hours and 59 minutes ago
    When I click "Cancel Order"
    And I select a reason
    And I click "Confirm Cancellation"
    Then the cancellation should be accepted
    And the order status should be "Cancelled"

  @edge-case @idempotency
  Scenario: Double-click on cancel button processes only once
    Given I have an order "ORD-55555" with status "Pending"
    When I navigate to order "ORD-55555"
    And I click the "Cancel Order" button
    And I select "Changed my mind" as the cancellation reason
    And I rapidly click "Confirm Cancellation" twice
    Then only one cancellation request should be processed
    And I should see a single success message
    And the audit log should show one cancellation event

  # ============================================================
  # ACCESSIBILITY SCENARIOS
  # ============================================================

  @accessibility @a11y
  Scenario: Cancel order using keyboard only
    Given I have an order "ORD-12345" with status "Pending"
    When I navigate to the order using Tab key
    And I press Enter on the "Cancel Order" button
    And I select a reason using arrow keys
    And I press Enter on "Confirm Cancellation"
    Then the cancellation should complete successfully
    And focus should move to the success message

  @accessibility @a11y @screen-reader
  Scenario: Screen reader announces cancellation result
    Given I am using a screen reader
    And I have an order "ORD-12345" with status "Pending"
    When I cancel the order
    Then the screen reader should announce "Order cancelled successfully"
    And the order status change should be announced via aria-live region

  # ============================================================
  # API SCENARIOS
  # ============================================================

  @api
  Scenario: Cancel order via API returns correct response
    Given I am authenticated as customer "CUST-001"
    And I have an order "ORD-12345" with status "Pending"
    When I send a POST request to "/api/v1/orders/ORD-12345/cancel" with body:
      """
      {
        "reason": "Changed my mind"
      }
      """
    Then the response status should be 200
    And the response should contain:
      """
      {
        "id": "ORD-12345",
        "status": "Cancelled",
        "cancellationReason": "Changed my mind",
        "cancelledAt": "<timestamp>"
      }
      """

  @api @error
  Scenario: API returns Problem Details for errors
    Given I am authenticated as customer "CUST-001"
    And order "ORD-67890" has status "Shipped"
    When I send a POST request to "/api/v1/orders/ORD-67890/cancel"
    Then the response status should be 409
    And the response Content-Type should be "application/problem+json"
    And the response should contain:
      """
      {
        "type": "https://api.example.com/errors/order-not-cancellable",
        "title": "Order Not Cancellable",
        "status": 409,
        "detail": "Order ORD-67890 has status 'Shipped' and cannot be cancelled"
      }
      """
```

---

## Test Mapping

| Scenario | Test Type | Framework | File |
|----------|-----------|-----------|------|
| Successfully cancel pending order | E2E | Playwright | cancel-order.spec.ts |
| Cannot cancel shipped order | E2E | Playwright | cancel-order.spec.ts |
| Cannot cancel after 24 hours | Unit | JUnit | OrderCancellationServiceTest.java |
| Cannot cancel another customer's order | Integration | Spring Test | OrderSecurityTest.java |
| Handle system unavailability | Integration | Vitest + MSW | order-service.test.ts |
| Partial cancellation | E2E | Playwright | partial-cancel.spec.ts |
| API returns correct response | Integration | Spring Test | OrderControllerTest.java |
| API returns Problem Details | Integration | Spring Test | OrderControllerTest.java |
| Keyboard accessibility | E2E | Playwright + axe | accessibility.spec.ts |
| Screen reader announcements | Manual | — | QA checklist |

---

## Scenario Coverage

| Category | Count | Coverage |
|----------|-------|----------|
| Happy Path | 2 | ✅ Complete |
| Failure Paths | 7 | ✅ Complete |
| Edge Cases | 6 | ✅ Complete |
| Accessibility | 2 | ✅ Complete |
| API | 2 | ✅ Complete |
| **Total** | **19** | ✅ Comprehensive |

---

## Tags Reference

| Tag | Purpose |
|-----|---------|
| `@happy-path` | Successful user flows |
| `@failure` | Expected error scenarios |
| `@edge-case` | Unusual but valid scenarios |
| `@accessibility` | A11y requirements |
| `@api` | API-level testing |
| `@smoke` | Critical path for smoke tests |
| `@security` | Security-related scenarios |
