import { useState, useRef, useEffect, useCallback } from 'react';
import { type OrderStatus } from '~/types/order';
import { StatusBadge } from './StatusBadge';

interface StatusUpdateModalProps {
  isOpen: boolean;
  currentStatus: OrderStatus;
  newStatus: OrderStatus;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  testId?: string;
}

/**
 * Confirmation modal for status updates.
 * 
 * Accessibility features:
 * - Focus trap while open
 * - ESC key to close
 * - ARIA labels and roles
 * - Focus returns to trigger on close
 */
export function StatusUpdateModal({
  isOpen,
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
  isLoading = false,
  testId = 'status-update-modal',
}: StatusUpdateModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const requiresReason = newStatus === 'CANCELLED';

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Save previous active element
      const previousActiveElement = document.activeElement as HTMLElement;
      
      // Focus first element in modal
      firstFocusableRef.current?.focus();

      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Status update dialog opened. Changing from ${currentStatus} to ${newStatus}.`;
      document.body.appendChild(announcement);

      return () => {
        previousActiveElement?.focus();
        announcement.remove();
      };
    }
  }, [isOpen, currentStatus, newStatus]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, isLoading, onCancel]);

  // Focus trap
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    []
  );

  const handleConfirm = () => {
    if (requiresReason && !reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }
    setError(null);
    onConfirm(reason || undefined);
  };

  const handleCancel = () => {
    setReason('');
    setError(null);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-testid={testId}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={isLoading ? undefined : handleCancel}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        onKeyDown={handleKeyDown}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
      >
        <h2 id="modal-title" className="text-lg font-semibold mb-4">
          Confirm Status Update
        </h2>

        <div className="space-y-4">
          {/* Status transition display */}
          <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 rounded-md">
            <StatusBadge status={currentStatus} />
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <StatusBadge status={newStatus} />
          </div>

          {/* Reason input for cancellation */}
          {requiresReason && (
            <div>
              <label 
                htmlFor="cancellation-reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="cancellation-reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Please provide a reason for cancellation..."
                className={`
                  w-full px-3 py-2 border rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${error ? 'border-red-500' : 'border-gray-300'}
                `}
                rows={3}
                aria-describedby={error ? 'reason-error' : undefined}
                aria-invalid={!!error}
              />
              {error && (
                <p id="reason-error" className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* Warning for cancelled status */}
          {newStatus === 'CANCELLED' && (
            <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">
                This action cannot be undone. The order will be permanently cancelled.
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            ref={firstFocusableRef}
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={lastFocusableRef}
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2 text-white rounded-md disabled:opacity-50
              ${newStatus === 'CANCELLED' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isLoading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
