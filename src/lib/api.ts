const BACKEND_BASE = 'https://note-app-backend-1-6y7y.onrender.com';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let currentAuthToken: string | null = null;
export function setApiAuthToken(token: string | null): void {
  currentAuthToken = token;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message: string | null = null;
    try {
      const text = await res.text();
      if (text) {
        try {
          const body = JSON.parse(text);
          message = body?.error ?? body?.message ?? body?.title ?? null;
        } catch {
          message = text.slice(0, 300);
        }
      }
    } catch {
      // ignore
    }
    if (!message) {
      if (res.status >= 500) {
        message = `The backend returned ${res.status} with no error details. The server is likely down or misconfigured.`;
      } else if (res.status === 404) {
        message = `Endpoint not found (404). This API path may have moved or been removed.`;
      } else if (res.status === 401) {
        message = 'Unauthorized. Please sign in again.';
      } else {
        message = `Request failed (${res.status}).`;
      }
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | null | undefined>): string {
  const url = new URL(path, BACKEND_BASE);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function headers(): HeadersInit {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (currentAuthToken) h.Authorization = `Bearer ${currentAuthToken}`;
  return h;
}

export const api = {
  async get<T>(path: string, params?: Record<string, string | number | boolean | null | undefined>): Promise<T> {
    const res = await fetch(buildUrl(path, params), {
      method: 'GET',
      headers: headers(),
      cache: 'no-store',
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async delete<T = void>(path: string): Promise<T> {
    const res = await fetch(buildUrl(path), {
      method: 'DELETE',
      headers: headers(),
    });
    return handleResponse<T>(res);
  },
};
