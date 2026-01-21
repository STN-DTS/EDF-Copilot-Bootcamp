# Frontend Development Instructions

## Technology Stack


## EDF Bootcamp Week 1 Frontend Stack

- Framework: React 18+ with React Router v7 (RRv7)
- State Management: RRv7 loaders/actions (no Redux for Week 1)
- Styling: CSS Modules or Tailwind (pick one for the repo)
- Build Tool: Vite
- Testing: Vitest + React Testing Library
- API: Fetch API with centralized error handling (Problem Details)

## RRv7 Patterns (MANDATORY)

All routes must use RRv7 loader/action conventions. Example:

```typescript
// src/routes/users.$id.tsx
import { LoaderFunctionArgs, ActionFunctionArgs, useLoaderData, useRouteError } from 'react-router-dom';

export async function loader({ params }: LoaderFunctionArgs) {
  // fetch data, return plain objects or Response
}

export async function action({ request }: ActionFunctionArgs) {
  // handle form submissions
}

export default function UserDetail() {
  const user = useLoaderData<typeof loader>();
  // component
}

export function ErrorBoundary() {
  const error = useRouteError();
  // display error
}
```

See `/docs/shared/reference-materials/PROMPT_PACK_V1.md` for prompt examples.

## Working Folder PR Guidance

All lab results must be submitted in `/working/frontend/{submitter_name}_{YYYYMMDD_HHMM}`. Each PR must:
- Place new or changed files in a new timestamped folder
- Include a README describing the lab, submitter, and date
- Be ordered chronologically by folder name

---

## File Structure

```
/src
  /components
  /pages
  /hooks
  /utils
  /services
  /styles
  /types
```

## Component Guidelines

### Component Structure

- Use functional components with hooks
- Keep components small and focused (Single Responsibility Principle)
- Extract reusable logic into custom hooks
- Use TypeScript for type safety

### Naming Conventions

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useUserData.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE

### Props and State

- Define prop types with TypeScript interfaces
- Keep state as local as possible
- Use prop drilling sparingly; consider context or state management
- Destructure props for clarity


## Styling Guidelines

- Follow a consistent styling methodology
- Use responsive design principles
- Implement accessibility (a11y) standards
- Maintain design system consistency

## Accessibility and Inclusion Guidance

- All components must meet WCAG 2.1 AA standards (labels, contrast, keyboard navigation)
- Use semantic HTML elements (e.g., <button>, <nav>, <main>)
- Test with screen readers and keyboard only
- Document accessibility decisions in PRs
- Use Copilot prompts to request accessible code (e.g., "Add ARIA attributes for this form")

## Testing

- Write tests for complex components
- Use React Testing Library patterns
- Test user interactions, not implementation
- Aim for meaningful test coverage

## Performance

- Implement code splitting for routes
- Optimize re-renders with React.memo, useMemo, useCallback
- Lazy load images and heavy components
- Monitor bundle size

## API Integration

- Centralize API calls in service files
- Handle loading, error, and success states
- Implement proper error boundaries
- Use async/await with proper error handling

## Best Practices

- Use ESLint and Prettier for code formatting
- Follow accessibility (WCAG) guidelines
- Implement proper error handling
- Write semantic HTML
- Keep dependencies up to date
