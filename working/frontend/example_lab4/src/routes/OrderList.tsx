import { useLoaderData, Await } from 'react-router-dom';
import { Suspense, useState, useCallback } from 'react';

interface Order {
  id: number;
  customerName: string;
  items: { id: number; name: string; quantity: number; price: number }[];
  status: string;
  total: number;
}

interface LoaderData {
  orders: Order[];
}

// === CONSTANTS (extracted in Lab 4 refactor) ===
const STATUS_COLORS = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
} as const;

const DEFAULT_STATUS = { bg: 'bg-gray-100', text: 'text-gray-800' };

/**
 * OrderList component - refactored in Lab 4.
 * 
 * Refactoring done:
 * 1. Extracted status colors to constant object
 * 2. Created getStatusConfig helper function
 * 3. Extracted OrderListError component
 * 4. Improved type safety with const assertion
 */
export function OrderList() {
  const data = useLoaderData() as LoaderData;
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
    window.location.reload();
  }, []);

  return (
    <Suspense fallback={<OrderListSkeleton />}>
      <Await 
        resolve={data.orders}
        errorElement={<OrderListError onRetry={handleRetry} />}
      >
        {(orders) => <OrderListContent orders={orders} />}
      </Await>
    </Suspense>
  );
}

// === ERROR COMPONENT (extracted in Lab 4 refactor) ===

interface OrderListErrorProps {
  onRetry: () => void;
}

function OrderListError({ onRetry }: OrderListErrorProps) {
  return (
    <div 
      className="p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
    >
      <h2 className="text-lg font-semibold text-red-800">
        Failed to load orders
      </h2>
      <p className="text-red-700 mt-1">
        Please check your connection and try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Retry
      </button>
    </div>
  );
}

function OrderListSkeleton() {
  return (
    <div data-testid="order-list-skeleton" className="p-4 space-y-4">
      <div role="status" className="sr-only">Loading orders...</div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

function OrderListContent({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul className="space-y-4" role="list" aria-label="Order list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <li className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <a 
          href={`/orders/${order.id}`}
          className="text-lg font-semibold text-blue-600 hover:text-blue-800"
        >
          Order #{order.id}
        </a>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-gray-600 mt-1">Customer: {order.customerName}</p>
      <div className="mt-2 text-sm text-gray-500">
        {formatItemCount(order.items.length)} • Total: {formatCurrency(order.total)}
      </div>
    </li>
  );
}

// === HELPER FUNCTIONS (extracted in Lab 4 refactor) ===

/**
 * Gets status configuration for a given status string.
 * Returns default gray styling for unknown statuses.
 */
function getStatusConfig(status: string) {
  const key = status.toLowerCase() as keyof typeof STATUS_COLORS;
  return STATUS_COLORS[key] || { ...DEFAULT_STATUS, label: status };
}

/**
 * Formats item count with proper pluralization.
 */
function formatItemCount(count: number): string {
  return `${count} item${count !== 1 ? 's' : ''}`;
}

/**
 * Formats a number as USD currency.
 */
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);
  
  return (
    <span 
      className={`px-2 py-1 text-sm rounded-full ${config.bg} ${config.text}`}
      role="status"
    >
      {config.label}
    </span>
  );
}

export default OrderList;
