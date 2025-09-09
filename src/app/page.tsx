"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Check if user is already authenticated
    const token = typeof window !== "undefined" ? localStorage.getItem("scp_admin_token") : null;

    if (token) {
      // User is logged in, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // User is not logged in, redirect to login page
      window.location.href = "/login";
    }
  }, []);

  // Show loading while redirecting
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-indigo-600">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium">Loading...</span>
      </div>
    </div>
  );
}
