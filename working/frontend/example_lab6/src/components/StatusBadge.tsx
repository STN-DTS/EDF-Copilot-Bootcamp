import { type OrderStatus } from '~/types/order';

/**
 * Status badge color mapping.
 * Uses Tailwind classes for consistent styling.
 */
const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; icon: string }> = {
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: '⏳',
  },
  CONFIRMED: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: '✓',
  },
  SHIPPED: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    icon: '📦',
  },
  DELIVERED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: '✅',
  },
  CANCELLED: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: '✕',
  },
};

interface StatusBadgeProps {
  status: OrderStatus;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional test ID for testing */
  testId?: string;
}

/**
 * Displays the current order status as a colored badge.
 * 
 * Accessibility: Uses both color and icon to convey status,
 * ensuring color is not the only indicator per WCAG guidelines.
 */
export function StatusBadge({ 
  status, 
  size = 'md',
  testId = 'status-badge'
}: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      data-testid={testId}
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${styles.bg} ${styles.text} ${sizeClasses[size]}
      `}
      role="status"
      aria-label={`Order status: ${status}`}
    >
      <span aria-hidden="true">{styles.icon}</span>
      {status}
    </span>
  );
}
