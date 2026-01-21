import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatusUpdateModal } from '~/components/StatusUpdateModal';

describe('StatusUpdateModal', () => {
  const defaultProps = {
    isOpen: true,
    currentStatus: 'PENDING' as const,
    newStatus: 'CONFIRMED' as const,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      render(<StatusUpdateModal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Confirm Status Update')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<StatusUpdateModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays current and new status badges', () => {
      render(<StatusUpdateModal {...defaultProps} />);
      
      expect(screen.getByText('PENDING')).toBeInTheDocument();
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
    });
  });

  describe('cancellation reason', () => {
    it('shows reason input when newStatus is CANCELLED', () => {
      render(<StatusUpdateModal {...defaultProps} newStatus="CANCELLED" />);
      
      expect(screen.getByLabelText(/Cancellation Reason/)).toBeInTheDocument();
    });

    it('does not show reason input for other statuses', () => {
      render(<StatusUpdateModal {...defaultProps} newStatus="CONFIRMED" />);
      
      expect(screen.queryByLabelText(/Cancellation Reason/)).not.toBeInTheDocument();
    });

    it('shows warning message for CANCELLED status', () => {
      render(<StatusUpdateModal {...defaultProps} newStatus="CANCELLED" />);
      
      expect(screen.getByText(/cannot be undone/)).toBeInTheDocument();
    });

    it('validates reason is required for CANCELLED', async () => {
      const user = userEvent.setup();
      render(<StatusUpdateModal {...defaultProps} newStatus="CANCELLED" />);
      
      await user.click(screen.getByText('Confirm'));
      
      expect(screen.getByText('Please provide a reason for cancellation')).toBeInTheDocument();
      expect(defaultProps.onConfirm).not.toHaveBeenCalled();
    });

    it('calls onConfirm with reason for CANCELLED', async () => {
      const user = userEvent.setup();
      render(<StatusUpdateModal {...defaultProps} newStatus="CANCELLED" />);
      
      await user.type(screen.getByLabelText(/Cancellation Reason/), 'Customer request');
      await user.click(screen.getByText('Confirm'));
      
      expect(defaultProps.onConfirm).toHaveBeenCalledWith('Customer request');
    });
  });

  describe('actions', () => {
    it('calls onConfirm when confirm button clicked', async () => {
      const user = userEvent.setup();
      render(<StatusUpdateModal {...defaultProps} />);
      
      await user.click(screen.getByText('Confirm'));
      
      expect(defaultProps.onConfirm).toHaveBeenCalledWith(undefined);
    });

    it('calls onCancel when cancel button clicked', async () => {
      const user = userEvent.setup();
      render(<StatusUpdateModal {...defaultProps} />);
      
      await user.click(screen.getByText('Cancel'));
      
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('calls onCancel when backdrop clicked', async () => {
      const user = userEvent.setup();
      render(<StatusUpdateModal {...defaultProps} />);
      
      const backdrop = screen.getByRole('dialog').querySelector('[aria-hidden="true"]');
      await user.click(backdrop!);
      
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('does not close when backdrop clicked during loading', async () => {
      const user = userEvent.setup();
      render(<StatusUpdateModal {...defaultProps} isLoading />);
      
      const backdrop = screen.getByRole('dialog').querySelector('[aria-hidden="true"]');
      await user.click(backdrop!);
      
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('shows loading text on confirm button', () => {
      render(<StatusUpdateModal {...defaultProps} isLoading />);
      
      expect(screen.getByText('Updating...')).toBeInTheDocument();
    });

    it('disables buttons during loading', () => {
      render(<StatusUpdateModal {...defaultProps} isLoading />);
      
      expect(screen.getByText('Cancel')).toBeDisabled();
      expect(screen.getByText('Updating...')).toBeDisabled();
    });
  });

  describe('keyboard navigation', () => {
    it('closes on ESC key', () => {
      render(<StatusUpdateModal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('does not close on ESC during loading', () => {
      render(<StatusUpdateModal {...defaultProps} isLoading />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(defaultProps.onCancel).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has role="dialog"', () => {
      render(<StatusUpdateModal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      render(<StatusUpdateModal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby pointing to title', () => {
      render(<StatusUpdateModal {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('shows red confirm button for CANCELLED status', () => {
      render(<StatusUpdateModal {...defaultProps} newStatus="CANCELLED" />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton.className).toContain('bg-red-600');
    });

    it('shows blue confirm button for other statuses', () => {
      render(<StatusUpdateModal {...defaultProps} newStatus="CONFIRMED" />);
      
      const confirmButton = screen.getByText('Confirm');
      expect(confirmButton.className).toContain('bg-blue-600');
    });
  });
});
