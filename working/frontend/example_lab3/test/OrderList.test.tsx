import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { OrderList } from './OrderList';

/**
 * Tests for OrderList component — written BEFORE implementation (TDD).
 * 
 * Acceptance Criteria:
 * 1. Order list page should display all orders with status badges
 * 2. Clicking an order should navigate to detail page
 * 3. Loading state should show skeleton UI
 * 4. Error state should show user-friendly message with retry button
 */

// Mock data from DOMAIN_CONTEXT.md
const mockOrders = [
  { id: 1, customerId: 1, items: [1, 2], status: 'pending' },
  { id: 2, customerId: 2, items: [3], status: 'completed' },
  { id: 3, customerId: 1, items: [1], status: 'cancelled' },
];

// Helper to render with router
function renderWithRouter(loader: () => Promise<unknown>) {
  const routes = [
    {
      path: '/orders',
      element: <OrderList />,
      loader,
    },
    {
      path: '/orders/:id',
      element: <div data-testid="order-detail">Order Detail</div>,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ['/orders'],
  });

  return render(<RouterProvider router={router} />);
}

describe('OrderList', () => {
  // ===========================================
  // Acceptance Criterion 3: Loading state
  // ===========================================
  
  it('AC3: renders loading skeleton while fetching', async () => {
    // Given - a loader that never resolves
    const loader = () => new Promise(() => {});
    
    // When
    renderWithRouter(loader);

    // Then
    expect(screen.getByTestId('order-list-skeleton')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  // ===========================================
  // Acceptance Criterion 1: Display orders with status badges
  // ===========================================
  
  it('AC1: renders order list with status badges', async () => {
    // Given
    const loader = async () => ({ orders: mockOrders });

    // When
    renderWithRouter(loader);

    // Then
    await waitFor(() => {
      expect(screen.getByText('Order #1')).toBeInTheDocument();
      expect(screen.getByText('Order #2')).toBeInTheDocument();
      expect(screen.getByText('Order #3')).toBeInTheDocument();
    });

    // Check status badges
    expect(screen.getByText('pending')).toHaveClass('badge-pending');
    expect(screen.getByText('completed')).toHaveClass('badge-completed');
    expect(screen.getByText('cancelled')).toHaveClass('badge-cancelled');
  });

  // ===========================================
  // Acceptance Criterion 4: Error state
  // ===========================================
  
  it('AC4: handles API error with retry button', async () => {
    // Given
    const loader = async () => {
      throw new Response(JSON.stringify({ detail: 'Server error' }), {
        status: 500,
      });
    };

    // When
    renderWithRouter(loader);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  // ===========================================
  // Acceptance Criterion 2: Navigate to detail
  // ===========================================
  
  it('AC2: navigates to detail on order click', async () => {
    // Given
    const user = userEvent.setup();
    const loader = async () => ({ orders: mockOrders });
    renderWithRouter(loader);

    // When
    await waitFor(() => {
      expect(screen.getByText('Order #1')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Order #1'));

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('order-detail')).toBeInTheDocument();
    });
  });

  // ===========================================
  // Edge Cases (Human-added)
  // ===========================================
  
  it('Edge: renders empty state when no orders', async () => {
    // Given
    const loader = async () => ({ orders: [] });

    // When
    renderWithRouter(loader);

    // Then
    await waitFor(() => {
      expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
    });
  });

  it('Edge: supports keyboard navigation', async () => {
    // Given
    const user = userEvent.setup();
    const loader = async () => ({ orders: mockOrders });
    renderWithRouter(loader);

    // When
    await waitFor(() => {
      expect(screen.getByText('Order #1')).toBeInTheDocument();
    });
    
    const firstOrder = screen.getByText('Order #1').closest('a');
    firstOrder?.focus();
    await user.keyboard('{Enter}');

    // Then
    await waitFor(() => {
      expect(screen.getByTestId('order-detail')).toBeInTheDocument();
    });
  });
});
