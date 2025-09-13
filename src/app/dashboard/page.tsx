"use client";

import type React from "react";

import { useEffect, useState, useCallback } from "react";
import { LogOut, Users } from "lucide-react";
import { type ApiClient, createApiClient } from "@/lib/api";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DataCard,
  MemberHierarchyDisplay,
  MemberHierarchySkeleton,
  TransactionStatsDisplay,
  TransactionStatsSkeleton,
} from "@/components";
import type {
  Division,
  MemberHierarchyResponse,
  TransactionResponse,
} from "@/lib/types";

type Loaded<T> = {
  loading: boolean;
  error?: string;
  data?: T;
};

export default function DashboardPage() {
  const [api] = useState<ApiClient>(() => createApiClient());
  const [adminToken, setAdminToken] = useState<string>("");
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [selectedDivision, setSelectedDivision] = useState<Division>("d1");

  const [hierarchyData, setHierarchyData] = useState<
    Loaded<MemberHierarchyResponse>
  >({
    loading: false,
  });
  const [expandedL4, setExpandedL4] = useState<Set<string>>(new Set());
  const [expandedHierarchyL2, setExpandedHierarchyL2] = useState<Set<string>>(
    new Set()
  );

  const [transactionData, setTransactionData] = useState<
    Loaded<TransactionResponse>
  >({
    loading: false,
  });

  const fetchHierarchyData = useCallback(
    async (event: "D1" | "D2") => {
      setHierarchyData({ loading: true });
      try {
        const response = await api.getMemberHierarchy({ event });
        setHierarchyData({ loading: false, data: response });
      } catch (error) {
        setHierarchyData({
          loading: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [api]
  );

  const fetchTransactionData = useCallback(
    async (event: "D1" | "D2") => {
      setTransactionData({ loading: true });
      try {
        const response = await api.getTransactions({ event });
        setTransactionData({ loading: false, data: response });
      } catch (error) {
        setTransactionData({
          loading: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [api]
  );

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("scp_admin_token")
        : null;
    if (stored) {
      api.setToken(stored);
      setAdminToken(stored);
      const event = selectedDivision === "d1" ? "D1" : "D2";
      fetchHierarchyData(event);
      fetchTransactionData(event);
    }
    setIsAuthChecking(false);
  }, [api, selectedDivision, fetchHierarchyData, fetchTransactionData]);

  useEffect(() => {
    const event = selectedDivision === "d1" ? "D1" : "D2";
    fetchHierarchyData(event);
    fetchTransactionData(event);
  }, [selectedDivision, fetchHierarchyData, fetchTransactionData]);


  const toggleL4Member = (memberId: string) => {
    const newExpanded = new Set(expandedL4);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
      setExpandedHierarchyL2((prev) => {
        const newL2 = new Set(prev);
        newL2.forEach((key) => {
          if (key.startsWith(`${memberId}-`)) {
            newL2.delete(key);
          }
        });
        return newL2;
      });
    } else {
      newExpanded.add(memberId);
    }
    setExpandedL4(newExpanded);
  };

  const toggleHierarchyL2Member = (l4MemberId: string, l2MemberId: string) => {
    const l2Key = `${l4MemberId}-${l2MemberId}`;
    const newExpanded = new Set(expandedHierarchyL2);
    if (newExpanded.has(l2Key)) {
      newExpanded.delete(l2Key);
    } else {
      newExpanded.add(l2Key);
    }
    setExpandedHierarchyL2(newExpanded);
  };

  // Fetch hierarchy data

  const handleLogout = () => {
    // Clear the token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("scp_admin_token");
    }
    // Reset auth state
    setAdminToken("");
    // Redirect to login
    window.location.href = "/login";
  };

  // Redirect to login if no token (after auth check is complete)
  useEffect(() => {
    if (!isAuthChecking && !adminToken) {
      window.location.href = "/login";
    }
  }, [adminToken, isAuthChecking]);

  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className="font-sans min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="text-base sm:text-lg font-medium">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 space-y-6 sm:space-y-8">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          <div className="inline-flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-3 bg-card/80 backdrop-blur-sm rounded-full border border-border shadow-lg">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-[#7033ff]">
              Street Cause Admin
            </h1>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 sm:px-4 border border-destructive text-destructive rounded-lg font-medium transition-colors duration-200 shadow-lg hover:bg-destructive/10 text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Member Hierarchy View */}
        <DataCard
          title={selectedDivision === "d1" ? "Dandiya 1 Overview" : "Dandiya 2 Overview"}
          error={hierarchyData.error || transactionData.error}
          divisionSelector={
            <div className="inline-flex bg-card/80 backdrop-blur-sm p-2 rounded-xl border border-border shadow-lg">
              <button
                onClick={() => setSelectedDivision("d1")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  selectedDivision === "d1"
                    ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Dandiya 1
              </button>
              <button
                onClick={() => setSelectedDivision("d2")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  selectedDivision === "d2"
                    ? "bg-primary text-primary-foreground shadow-lg transform scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Dandiya 2
              </button>
            </div>
          }
        >
          {/* Transaction Statistics */}
          {transactionData.loading ? (
            <TransactionStatsSkeleton />
          ) : (
            transactionData.data && (
              <TransactionStatsDisplay
                data={transactionData.data.data}
                selectedDivision={selectedDivision}
              />
            )
          )}

          {/* Member Hierarchy View */}
          {hierarchyData.loading ? (
            <MemberHierarchySkeleton />
          ) : (
            hierarchyData.data && (
              <MemberHierarchyDisplay
                data={hierarchyData.data.data}
                expandedL4={expandedL4}
                expandedL2={expandedHierarchyL2}
                toggleL4Member={toggleL4Member}
                toggleL2Member={(key: string) => {
                  const [l4Id, l2Id] = key.split("-");
                  toggleHierarchyL2Member(l4Id, l2Id);
                }}
              />
            )
          )}
        </DataCard>
      </div>
    </div>
  );
}
