import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { OrderList } from '../src/routes/OrderList';

const mockOrders = [
  { id: 1, customerName: 'Alice', items: [{ id: 1, name: 'Widget', quantity: 2, price: 10 }], status: 'pending', total: 20 },
  { id: 2, customerName: 'Bob', items: [{ id: 2, name: 'Gadget', quantity: 1, price: 25 }], status: 'completed', total: 25 },
];

function renderWithRouter(loader: () => Promise<unknown>) {
  const routes = [
    { path: '/orders', element: <OrderList />, loader },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ['/orders'] });
  return render(<RouterProvider router={router} />);
}

describe('OrderList (Lab 4 refactored)', () => {
  it('renders orders correctly', async () => {
    renderWithRouter(async () => ({ orders: mockOrders }));
    await waitFor(() => {
      expect(screen.getByText('Order #1')).toBeInTheDocument();
      expect(screen.getByText('Order #2')).toBeInTheDocument();
    });
  });

  it('displays status badges with correct text', async () => {
    renderWithRouter(async () => ({ orders: mockOrders }));
    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('formats currency correctly', async () => {
    renderWithRouter(async () => ({ orders: mockOrders }));
    await waitFor(() => {
      expect(screen.getByText(/\$20\.00/)).toBeInTheDocument();
      expect(screen.getByText(/\$25\.00/)).toBeInTheDocument();
    });
  });

  it('shows loading skeleton', () => {
    renderWithRouter(() => new Promise(() => {}));
    expect(screen.getByTestId('order-list-skeleton')).toBeInTheDocument();
  });

  // === NEW TEST ADDED IN LAB 4 REFACTOR ===
  
  it('Lab 4: handles unknown status gracefully with default styling', async () => {
    const ordersWithUnknownStatus = [
      { id: 99, customerName: 'Test', items: [], status: 'unknown_status', total: 0 },
    ];
    
    renderWithRouter(async () => ({ orders: ordersWithUnknownStatus }));
    
    await waitFor(() => {
      // Should display the raw status value when unknown
      expect(screen.getByText('unknown_status')).toBeInTheDocument();
    });
  });
});
