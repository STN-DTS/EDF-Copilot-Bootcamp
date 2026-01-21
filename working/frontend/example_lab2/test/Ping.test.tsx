import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Ping, loader } from '../src/routes/Ping';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

function renderWithRouter(loaderFn: typeof loader) {
  const routes = [
    {
      path: '/ping',
      element: <Ping />,
      loader: loaderFn,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: ['/ping'],
  });

  return render(<RouterProvider router={router} />);
}

describe('Ping Route', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders success state with status ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    renderWithRouter(loader);

    await waitFor(() => {
      expect(screen.getByText(/status:/i)).toBeInTheDocument();
      expect(screen.getByText('ok')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithRouter(loader);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/API returned 500/i)).toBeInTheDocument();
    });
  });

  it('renders error state when network fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(loader);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to connect/i)).toBeInTheDocument();
    });
  });

  it('shows retry button on error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithRouter(loader);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
