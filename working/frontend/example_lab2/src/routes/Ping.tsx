import { useLoaderData } from 'react-router-dom';

/**
 * Ping route component - calls /api/ping and displays result.
 * Part of Lab 2 vertical slice scaffold.
 */
export function Ping() {
  const data = useLoaderData() as { status: string } | { error: string };

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

  // Success state
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h2 className="text-lg font-semibold text-green-800">API Status</h2>
      <p className="text-green-700">
        Status: <span className="font-mono">{data.status}</span>
      </p>
    </div>
  );
}

/**
 * Loader function for the ping route.
 * Calls /api/ping and returns the response.
 */
export async function loader() {
  try {
    const response = await fetch('/api/ping');
    
    if (!response.ok) {
      return { error: `API returned ${response.status}` };
    }
    
    return await response.json();
  } catch (error) {
    return { error: 'Failed to connect to API' };
  }
}

// Default export for React Router v7
export default Ping;
