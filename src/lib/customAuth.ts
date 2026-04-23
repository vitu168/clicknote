import { api, ApiError, setApiAuthToken } from '@/lib/api';

/**
 * Port of `lib/core/data/services/custom_auth_service.dart` from the Flutter
 * note_app. Auth calls hit the same backend endpoints and tokens are persisted
 * in localStorage (the web analogue of SharedPreferences).
 */

export interface AuthResponse {
  userId: string;
  email: string;
  name: string | null;
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  name: string | null;
  accessToken: string;
}

const TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_ID_KEY = 'auth_user_id';
const EMAIL_KEY = 'auth_email';
const NAME_KEY = 'auth_name';

const AUTH_EVENT = 'yby-auth-change';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function parseAuthResponse(raw: unknown): AuthResponse {
  const data = (raw ?? {}) as Record<string, unknown>;
  const accessToken = String(data.accessToken ?? '');
  const userId = String(data.userId ?? '');
  const email = String(data.email ?? '');
  const refreshToken = String(data.refreshToken ?? '');
  const name = data.name == null ? null : String(data.name);
  if (!accessToken || !userId) {
    throw new ApiError(500, 'Auth response missing accessToken or userId.');
  }
  return { userId, email, name, accessToken, refreshToken };
}

async function saveAuth(auth: AuthResponse): Promise<void> {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, auth.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  window.localStorage.setItem(USER_ID_KEY, auth.userId);
  window.localStorage.setItem(EMAIL_KEY, auth.email);
  if (auth.name) window.localStorage.setItem(NAME_KEY, auth.name);
  else window.localStorage.removeItem(NAME_KEY);
  setApiAuthToken(auth.accessToken);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

function clearStoredAuth(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_ID_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
  window.localStorage.removeItem(NAME_KEY);
  setApiAuthToken(null);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

function toAuthUser(auth: AuthResponse): AuthUser {
  return { userId: auth.userId, email: auth.email, name: auth.name, accessToken: auth.accessToken };
}

export const customAuth = {
  /** POST /api/auth/signup */
  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    const raw = await api.post<unknown>('/api/auth/signup', { email, password, name });
    const auth = parseAuthResponse(raw);
    await saveAuth(auth);
    return toAuthUser(auth);
  },

  /** POST /api/auth/signin */
  async signIn(email: string, password: string, fcmToken?: string): Promise<AuthUser> {
    const body: Record<string, unknown> = { email, password };
    if (fcmToken) body.fcmToken = fcmToken;
    const raw = await api.post<unknown>('/api/auth/signin', body);
    const auth = parseAuthResponse(raw);
    await saveAuth(auth);
    return toAuthUser(auth);
  },

  /** POST /api/auth/forgot-password — sends a password-reset email via the backend. */
  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/auth/forgot-password', { email });
  },

  /**
   * Sign out — matches Flutter CustomAuthService.signOut:
   *   DELETE /api/device/:userId  (best-effort)
   *   clear all stored tokens
   */
  async signOut(): Promise<void> {
    const current = this.getCurrentUser();
    if (current?.userId) {
      try {
        await api.delete(`/api/device/${current.userId}`);
      } catch {
        // best-effort
      }
    }
    clearStoredAuth();
  },

  /** Read the current user from localStorage. */
  getCurrentUser(): AuthUser | null {
    if (!isBrowser()) return null;
    const accessToken = window.localStorage.getItem(TOKEN_KEY);
    const userId = window.localStorage.getItem(USER_ID_KEY);
    const email = window.localStorage.getItem(EMAIL_KEY);
    if (!accessToken || !userId || !email) return null;
    const name = window.localStorage.getItem(NAME_KEY);
    setApiAuthToken(accessToken);
    return { userId, email, name, accessToken };
  },

  /** Read the stored access token (or null). */
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  /** Read the stored refresh token (or null). */
  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() != null;
  },

  /** Locally update the stored display name (after /complete-profile). */
  setName(name: string | null): void {
    if (!isBrowser()) return;
    if (name) window.localStorage.setItem(NAME_KEY, name);
    else window.localStorage.removeItem(NAME_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  },

  /** POST /api/device/save-token — matches Flutter CustomAuthService.saveFcmToken. */
  async saveFcmToken(fcmToken: string): Promise<void> {
    try {
      await api.post('/api/device/save-token', { fcmToken });
    } catch {
      // best-effort; notifications are non-critical
    }
  },

  /** Subscribe to login/logout/name changes (for the SessionProvider). */
  onChange(listener: () => void): () => void {
    if (!isBrowser()) return () => {};
    const handler = () => listener();
    window.addEventListener(AUTH_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(AUTH_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  },
};

/** Call once on app bootstrap so API requests carry the Bearer token. */
export function bootstrapAuthToken(): void {
  if (!isBrowser()) return;
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) setApiAuthToken(token);
}
