/**
 * Environment configuration for the frontend application.
 * 
 * This module provides type-safe access to environment variables
 * and handles defaults for development vs production.
 * 
 * Lab 5: OpenShift Readiness - Configuration Externalization
 */

/**
 * Environment configuration interface.
 */
interface EnvConfig {
  /** Base URL for API calls */
  apiUrl: string;
  /** Current environment mode */
  mode: 'development' | 'production' | 'test';
  /** Whether running in development mode */
  isDev: boolean;
  /** Whether running in production mode */
  isProd: boolean;
}

/**
 * Gets the API URL from environment or falls back to default.
 */
function getApiUrl(): string {
  // Vite exposes env vars with VITE_ prefix
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }
  
  // Production should always have VITE_API_URL set
  console.warn('VITE_API_URL not set, using relative path');
  return '';
}

/**
 * Application environment configuration.
 * Access API URL and environment mode from this object.
 * 
 * @example
 * ```ts
 * import { env } from '~/config/env';
 * 
 * fetch(`${env.apiUrl}/orders`);
 * 
 * if (env.isDev) {
 *   console.log('Debug info...');
 * }
 * ```
 */
export const env: EnvConfig = {
  apiUrl: getApiUrl(),
  mode: import.meta.env.MODE as EnvConfig['mode'],
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

/**
 * Validates that required environment variables are set.
 * Call this at app startup to fail fast.
 */
export function validateEnv(): void {
  if (env.isProd && !import.meta.env.VITE_API_URL) {
    console.error('Production requires VITE_API_URL to be set');
  }
}

export default env;
