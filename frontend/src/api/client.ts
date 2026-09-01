import type { ApiError, ApiSettings } from '../types/studyPlanner';

const DEFAULT_SETTINGS_KEY = 'study_planner_api_settings';

export const getStoredSettings = (): ApiSettings => {
  const stored = localStorage.getItem(DEFAULT_SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    basicAuthUser: import.meta.env.VITE_BASIC_AUTH_USER || 'admin',
    basicAuthPass: import.meta.env.VITE_BASIC_AUTH_PASS || 'admin',
  };
};

export const saveSettings = (settings: ApiSettings): void => {
  localStorage.setItem(DEFAULT_SETTINGS_KEY, JSON.stringify(settings));
};

export class NormalizedApiError extends Error {
  apiError: ApiError;

  constructor(apiError: ApiError) {
    super(apiError.message || 'API request failed');
    this.name = 'NormalizedApiError';
    this.apiError = apiError;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const settings = getStoredSettings();
  const url = path.startsWith('http') ? path : `${settings.baseUrl}${path}`;

  const headers = new Headers(options.headers || {});
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Basic Auth header
  if (settings.basicAuthUser || settings.basicAuthPass) {
    const credentials = btoa(`${settings.basicAuthUser}:${settings.basicAuthPass}`);
    headers.set('Authorization', `Basic ${credentials}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    // Network failure
    throw new NormalizedApiError({
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the server. Please check your network connection and API base URL.',
      errors: [],
      status: 0,
      requestURI: path,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let responseData: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    let normalizedError: ApiError;

    if (responseData && typeof responseData === 'object' && 'code' in responseData) {
      normalizedError = responseData as ApiError;
    } else if (response.status === 401) {
      normalizedError = {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed. Please verify your username and password in Settings.',
        errors: [],
        status: 401,
        requestURI: path,
        timestamp: new Date().toISOString(),
      };
    } else if (response.status === 404) {
      normalizedError = {
        code: 'RESOURCE_NOT_FOUND',
        message: 'The requested resource was not found.',
        errors: [],
        status: 404,
        requestURI: path,
        timestamp: new Date().toISOString(),
      };
    } else if (response.status === 409) {
      normalizedError = {
        code: 'CONFLICT',
        message: responseData?.message || 'A resource conflict occurred.',
        errors: [],
        status: 409,
        requestURI: path,
        timestamp: new Date().toISOString(),
      };
    } else {
      normalizedError = {
        code: response.status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'MALFORMED_REQUEST',
        message: response.status >= 500
          ? 'Internal server error occurred. Please retry later.'
          : 'Request is invalid.',
        errors: [],
        status: response.status,
        requestURI: path,
        timestamp: new Date().toISOString(),
      };
    }

    throw new NormalizedApiError(normalizedError);
  }

  return responseData as T;
}
