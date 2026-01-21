import { type OrderStatus } from '~/types/order';

/**
 * API client for order status operations.
 * 
 * All functions handle Problem Details responses and throw
 * typed errors for UI consumption.
 */

const API_BASE = '/api/orders';

export interface StatusUpdateRequest {
  newStatus: OrderStatus;
  reason?: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly problemDetails?: ProblemDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Updates the status of an order.
 * 
 * @param orderId - The order ID
 * @param newStatus - The target status
 * @param reason - Required when newStatus is CANCELLED
 * @throws {ApiError} When the API returns an error response
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  reason?: string
): Promise<Order> {
  const response = await fetch(`${API_BASE}/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newStatus, reason }),
  });

  if (!response.ok) {
    const problemDetails = await response.json().catch(() => null);
    throw new ApiError(
      problemDetails?.detail || `Failed to update order status`,
      response.status,
      problemDetails
    );
  }

  return response.json();
}

/**
 * Gets valid next statuses for an order.
 * 
 * @param orderId - The order ID
 * @returns Array of valid next statuses (empty for terminal states)
 */
export async function getValidNextStatuses(
  orderId: string
): Promise<OrderStatus[]> {
  const response = await fetch(`${API_BASE}/${orderId}/status/next`);

  if (!response.ok) {
    throw new ApiError(
      'Failed to fetch valid statuses',
      response.status
    );
  }

  return response.json();
}
