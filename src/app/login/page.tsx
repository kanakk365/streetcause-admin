"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { type ApiClient, createApiClient } from "@/lib/api";

export default function LoginPage() {
  const [api] = useState<ApiClient>(() => createApiClient());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("scp_admin_token")
        : null;
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  async function handleAdminLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const res = await api.adminLogin({ username, password });
      const token = extractToken(res);
      if (!token) throw new Error("Token not found in response");

      api.setToken(token);
      localStorage.setItem("scp_admin_token", token);

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  function extractToken(res: unknown): string | undefined {
    if (!res || typeof res !== "object") return undefined;
    const obj = res as Record<string, unknown>;

    const data = obj.data;
    if (data && typeof data === "object") {
      const dataObj = data as Record<string, unknown>;
      const token = dataObj.token;
      if (typeof token === "string" && token.length > 0) return token;
    }
    return undefined;
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-100 rounded-full mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-indigo-800">Street Cause</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
          <p className="text-slate-600 mt-2">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
