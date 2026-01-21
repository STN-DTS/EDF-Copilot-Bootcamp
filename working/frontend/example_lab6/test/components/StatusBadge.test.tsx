import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '~/components/StatusBadge';

describe('StatusBadge', () => {
  describe('rendering', () => {
    it('renders PENDING with yellow styling', () => {
      render(<StatusBadge status="PENDING" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('PENDING');
      expect(badge).toHaveTextContent('⏳');
      expect(badge.className).toContain('bg-yellow-100');
      expect(badge.className).toContain('text-yellow-800');
    });

    it('renders CONFIRMED with blue styling', () => {
      render(<StatusBadge status="CONFIRMED" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('CONFIRMED');
      expect(badge).toHaveTextContent('✓');
      expect(badge.className).toContain('bg-blue-100');
      expect(badge.className).toContain('text-blue-800');
    });

    it('renders SHIPPED with purple styling', () => {
      render(<StatusBadge status="SHIPPED" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('SHIPPED');
      expect(badge).toHaveTextContent('📦');
      expect(badge.className).toContain('bg-purple-100');
      expect(badge.className).toContain('text-purple-800');
    });

    it('renders DELIVERED with green styling', () => {
      render(<StatusBadge status="DELIVERED" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('DELIVERED');
      expect(badge).toHaveTextContent('✅');
      expect(badge.className).toContain('bg-green-100');
      expect(badge.className).toContain('text-green-800');
    });

    it('renders CANCELLED with red styling', () => {
      render(<StatusBadge status="CANCELLED" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('CANCELLED');
      expect(badge).toHaveTextContent('✕');
      expect(badge.className).toContain('bg-red-100');
      expect(badge.className).toContain('text-red-800');
    });
  });

  describe('size variants', () => {
    it('applies small size classes', () => {
      render(<StatusBadge status="PENDING" size="sm" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge.className).toContain('text-xs');
    });

    it('applies medium size classes by default', () => {
      render(<StatusBadge status="PENDING" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge.className).toContain('text-sm');
    });

    it('applies large size classes', () => {
      render(<StatusBadge status="PENDING" size="lg" />);
      
      const badge = screen.getByTestId('status-badge');
      expect(badge.className).toContain('text-base');
    });
  });

  describe('accessibility', () => {
    it('has role="status"', () => {
      render(<StatusBadge status="PENDING" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });

    it('has aria-label describing the status', () => {
      render(<StatusBadge status="CONFIRMED" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Order status: CONFIRMED');
    });

    it('hides icon from screen readers', () => {
      render(<StatusBadge status="SHIPPED" />);
      
      const badge = screen.getByTestId('status-badge');
      const iconSpan = badge.querySelector('[aria-hidden="true"]');
      expect(iconSpan).toBeInTheDocument();
    });
  });

  describe('custom testId', () => {
    it('accepts custom data-testid', () => {
      render(<StatusBadge status="PENDING" testId="custom-badge" />);
      
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toBeInTheDocument();
    });
  });
});
