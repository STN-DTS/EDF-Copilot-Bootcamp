import { useState, useRef, useEffect, useCallback } from 'react';
import { type OrderStatus } from '~/types/order';
import { StatusBadge } from './StatusBadge';

interface StatusDropdownProps {
  currentStatus: OrderStatus;
  validStatuses: OrderStatus[];
  onSelect: (status: OrderStatus) => void;
  disabled?: boolean;
  testId?: string;
}

/**
 * Dropdown for selecting a new order status.
 * 
 * Only shows valid next statuses based on the state machine.
 * Fully keyboard accessible with arrow key navigation.
 */
export function StatusDropdown({
  currentStatus,
  validStatuses,
  onSelect,
  disabled = false,
  testId = 'status-dropdown',
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hasValidStatuses = validStatuses.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, validStatuses.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (validStatuses[focusedIndex]) {
            onSelect(validStatuses[focusedIndex]);
            setIsOpen(false);
            buttonRef.current?.focus();
          }
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, focusedIndex, validStatuses, onSelect]
  );

  const handleSelect = (status: OrderStatus) => {
    onSelect(status);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div 
      ref={dropdownRef} 
      className="relative inline-block"
      data-testid={testId}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled || !hasValidStatuses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={
          hasValidStatuses 
            ? `Change status from ${currentStatus}. ${validStatuses.length} options available.`
            : `Current status: ${currentStatus}. No status changes available.`
        }
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-md border
          ${disabled || !hasValidStatuses
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        <span>Update Status</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && hasValidStatuses && (
        <ul
          role="listbox"
          aria-label="Select new status"
          className="absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg"
          onKeyDown={handleKeyDown}
        >
          {validStatuses.map((status, index) => (
            <li
              key={status}
              role="option"
              aria-selected={index === focusedIndex}
              onClick={() => handleSelect(status)}
              className={`
                px-4 py-2 cursor-pointer flex items-center gap-2
                ${index === focusedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}
              `}
            >
              <StatusBadge status={status} size="sm" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
