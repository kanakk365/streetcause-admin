import { AdminLoginRequest, AdminLoginResponse, AdminStatsQuery, AdminStatsResponse } from "./types";

const DEFAULT_BASE_URL = "https://scpapi.elitceler.com/api/v1";

export interface ApiClient {
  setToken(token?: string): void;
  adminLogin(body: AdminLoginRequest): Promise<AdminLoginResponse>;
  getAdminStats(query?: AdminStatsQuery): Promise<AdminStatsResponse>;
}

export function createApiClient(baseUrl: string = DEFAULT_BASE_URL, initialToken?: string): ApiClient {
  let token = initialToken;

  const buildHeaders = (): HeadersInit => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...init,
      headers: { ...buildHeaders(), ...(init?.headers ?? {}) },
      cache: "no-store",
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`Request failed ${res.status}: ${msg}`);
    }
    // some endpoints may return empty
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  };

  return {
    setToken(newToken?: string) {
      token = newToken;
    },

    // Admin
    adminLogin(body: AdminLoginRequest): Promise<AdminLoginResponse> {
      return request(`/admin/login`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    getAdminStats(query: AdminStatsQuery = {}): Promise<AdminStatsResponse> {
      const params = new URLSearchParams();
      if (query.page) params.set("page", String(query.page));
      if (query.limit) params.set("limit", String(query.limit));
      const qs = params.toString();
      return request(`/admin/stats${qs ? `?${qs}` : ""}`);
    },
  };
}

export const api = createApiClient();


