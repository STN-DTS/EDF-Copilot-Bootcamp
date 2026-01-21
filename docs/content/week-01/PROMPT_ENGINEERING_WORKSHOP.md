# Prompt Engineering Mini-Workshop

## Why Prompt Engineering?
Well-crafted prompts make Copilot more effective and reduce frustration. This workshop covers best practices and before/after examples.

## Best Practices
- Always provide context (paths, stack, constraints)
- Be explicit about goals and acceptance criteria
- Use small, focused prompts (avoid multi-step requests)
- Ask for a plan before code
- Request tests and verification steps
- Specify output format if needed

## Before/After Examples

**Before:**
> "Add an endpoint for orders."

**After:**
> "In src/controllers/OrderController.java, add a GET endpoint `/api/orders` that returns all orders. Use Spring Boot 3.x, Oracle, and Problem Details for errors. Add a unit test in src/test/java/..."

**Before:**
> "Fix the bug in the UI."

**After:**
> "In src/pages/OrderList.tsx, fix the bug where completed orders are not shown. Use React Router v7 loader pattern. Add a test in src/pages/__tests__/OrderList.test.tsx."

## Practice
Try rewriting 3 of your own prompts using these guidelines. Share before/after in your working folder.
