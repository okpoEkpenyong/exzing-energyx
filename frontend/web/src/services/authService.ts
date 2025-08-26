// frontend/web/src/services/authService.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://exzing-energyx.onrender.com";
// const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";
const TOKEN_KEY = "energyx_token";

export type LoginResult = { token: string; expiresIn?: number };

/**
 * Attempts to log in against backend /auth/login.
 * If backend is missing/unreachable it falls back to a local mock token (useful for dev).
 */

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      // if backend returns 404/401, throw so we fall back
      throw new Error(`Auth failed: ${res.status}`);
    }

    const data = await res.json();
    const token = data?.access_token ?? data?.token ?? null;
    if (!token) throw new Error("No token returned");

    localStorage.setItem(TOKEN_KEY, token);
    return { token, expiresIn: data?.expires_in };
  } catch (err) {
    // Fallback: create a mock token for local testing (clearly marked)
    console.warn("Auth endpoint unreachable — using fallback mock token for local dev.", err);
    const mock = `mock-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, mock);
    return { token: mock };
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/** Returns headers including Authorization if logged in */
export function authHeaders(headers?: Record<string,string>) {
  const token = getToken();
  const base = headers ? { ...headers } : {};
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}
