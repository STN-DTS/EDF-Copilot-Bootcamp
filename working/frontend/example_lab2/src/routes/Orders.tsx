import { useLoaderData, Link } from 'react-router-dom';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  status: string;
  total: number;
}

/**
 * Orders list route component.
 * Displays sample order data from the API.
 * Part of Lab 2 vertical slice scaffold (stretch goal).
 */
export function Orders() {
  const data = useLoaderData() as { orders: Order[] } | { error: string };

  // Error state
  if ('error' in data) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800">Error</h2>
        <p className="text-red-700">{data.error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { orders } = data;

  // Success state
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">Customer: {order.customerName}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
                Total: ${order.total.toFixed(2)}
              </p>
            </div>
            
            <Link 
              to={`/orders/${order.id}`}
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Status badge component with color coding.
 */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const colorClass = colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 text-sm rounded-full ${colorClass}`}>
      {status}
    </span>
  );
}

/**
 * Loader function for the orders route.
 */
export async function loader() {
  try {
    const response = await fetch('/api/orders');
    
    if (!response.ok) {
      return { error: `API returned ${response.status}` };
    }
    
    const orders = await response.json();
    return { orders };
  } catch (error) {
    return { error: 'Failed to connect to API' };
  }
}

export default Orders;
