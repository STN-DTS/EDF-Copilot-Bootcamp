import { useState } from 'react';
import { 
  useLoaderData, 
  useFetcher,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from 'react-router';
import { StatusBadge } from '~/components/StatusBadge';
import { StatusDropdown } from '~/components/StatusDropdown';
import { StatusUpdateModal } from '~/components/StatusUpdateModal';
import { updateOrderStatus, getValidNextStatuses, ApiError } from '~/lib/orderStatusApi';
import type { Order, OrderStatus } from '~/types/order';

/**
 * Route: /orders/:orderId/status
 * 
 * Displays order status and allows CSRs to update it.
 */

interface LoaderData {
  order: Order;
  validNextStatuses: OrderStatus[];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { orderId } = params;
  
  if (!orderId) {
    throw new Response('Order ID is required', { status: 400 });
  }

  try {
    // In a real app, these would be parallel API calls
    const orderResponse = await fetch(`/api/orders/${orderId}`);
    if (!orderResponse.ok) {
      throw new Response('Order not found', { status: 404 });
    }
    const order = await orderResponse.json();

    const validNextStatuses = await getValidNextStatuses(orderId);

    return json<LoaderData>({ order, validNextStatuses });
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response('Failed to load order', { status: 500 });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { orderId } = params;
  
  if (!orderId) {
    return json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const newStatus = formData.get('newStatus') as OrderStatus;
  const reason = formData.get('reason') as string | null;

  try {
    const updatedOrder = await updateOrderStatus(orderId, newStatus, reason ?? undefined);
    return json({ success: true, order: updatedOrder });
  } catch (error) {
    if (error instanceof ApiError) {
      return json(
        { 
          error: error.message,
          problemDetails: error.problemDetails 
        },
        { status: error.status }
      );
    }
    return json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

export default function OrderStatusRoute() {
  const { order, validNextStatuses } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isUpdating = fetcher.state !== 'idle';
  const hasError = fetcher.data?.error;

  const handleStatusSelect = (status: OrderStatus) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const handleConfirm = (reason?: string) => {
    if (!selectedStatus) return;

    const formData = new FormData();
    formData.set('newStatus', selectedStatus);
    if (reason) {
      formData.set('reason', reason);
    }

    fetcher.submit(formData, { method: 'PUT' });
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <StatusBadge status={order.status} size="lg" />
      </div>

      {/* Status update section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Update Status</h2>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Current Status:</span>
          <StatusBadge status={order.status} />
          
          <StatusDropdown
            currentStatus={order.status}
            validStatuses={validNextStatuses}
            onSelect={handleStatusSelect}
            disabled={isUpdating}
          />
        </div>

        {/* Error display */}
        {hasError && (
          <div 
            role="alert" 
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800"
          >
            {fetcher.data.error}
          </div>
        )}

        {/* Success message */}
        {fetcher.data?.success && (
          <div 
            role="status"
            aria-live="polite" 
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800"
          >
            Order status updated successfully!
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {selectedStatus && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          currentStatus={order.status}
          newStatus={selectedStatus}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
