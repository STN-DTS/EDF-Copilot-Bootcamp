import { Link, useLoaderData, useNavigation } from 'react-router-dom';
import type { Order } from '../types';

/**
 * OrderList component — minimal implementation to pass tests (TDD approach).
 * 
 * Uses React Router v7 patterns:
 * - useLoaderData for data fetching
 * - useNavigation for loading states
 * - Link for navigation
 */

interface LoaderData {
  orders: Order[];
}

export function OrderList() {
  const { orders } = useLoaderData() as LoaderData;
  const navigation = useNavigation();

  // AC3: Loading state
  if (navigation.state === 'loading') {
    return (
      <div data-testid="order-list-skeleton" role="status">
        <span className="sr-only">Loading orders...</span>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-row" aria-hidden="true" />
        ))}
      </div>
    );
  }

  // Edge: Empty state
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p>No orders found</p>
      </div>
    );
  }

  // AC1: Display orders with status badges
  // AC2: Navigate to detail on click
  return (
    <ul className="order-list">
      {orders.map((order) => (
        <li key={order.id}>
          <Link to={`/orders/${order.id}`} className="order-link">
            <span>Order #{order.id}</span>
            <span className={`badge badge-${order.status}`}>
              {order.status}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// AC4: Error handling is done via RRv7 errorElement in route config
export function OrderListError() {
  return (
    <div className="error-state">
      <p>Something went wrong loading orders.</p>
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
}
