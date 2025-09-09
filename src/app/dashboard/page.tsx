"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { ChevronRight, ChevronDown, Users, TrendingUp, DollarSign, User, LogOut } from "lucide-react"
import { type ApiClient, createApiClient } from "@/lib/api"
import type { AdminStatsData, AdminStatsResponse, Division, L1Member } from "@/lib/types"

type Loaded<T> = {
  loading: boolean
  error?: string
  data?: T
}

export default function DashboardPage() {
  const [api] = useState<ApiClient>(() => createApiClient())
  const [adminToken, setAdminToken] = useState<string>("")
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true)
  const [selectedDivision, setSelectedDivision] = useState<Division>("d1")
  const [stats, setStats] = useState<Loaded<AdminStatsResponse>>({ loading: false })
  const [expandedL1, setExpandedL1] = useState<Set<string>>(new Set())
  const [expandedL2, setExpandedL2] = useState<Set<string>>(new Set())

  // Pagination state for infinite scroll
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasMorePages, setHasMorePages] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [accumulatedData, setAccumulatedData] = useState<AdminStatsData | null>(null)

  // Intersection observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Load stored token and fetch stats
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scp_admin_token") : null
    if (stored) {
      api.setToken(stored)
      setAdminToken(stored)
      // Reset pagination state
      setCurrentPage(1)
      setHasMorePages(true)
      setLoadingMore(false)
      setAccumulatedData(null)
      setStats({ loading: true })
      api
        .getAdminStats({ page: 1, limit: 10 })
        .then((s) => {
          setStats({ loading: false, data: s })
          setAccumulatedData(s.data)
          setHasMorePages(s.meta.pagination.page < s.meta.pagination.totalPages)
        })
        .catch((e: unknown) => setStats({ loading: false, error: e instanceof Error ? e.message : String(e) }))
    }
    setIsAuthChecking(false)
  }, [api])


  // Function to load more data for infinite scroll
  const loadMoreData = useCallback(async () => {
    if (!hasMorePages || loadingMore || !accumulatedData) return

    setLoadingMore(true)
    const nextPage = currentPage + 1

    try {
      const response = await api.getAdminStats({ page: nextPage, limit: 10 })

      // Merge the new data with accumulated data
      const newAccumulatedData: AdminStatsData = {
        ...accumulatedData,
        detailedStats: {
          d1: {
            ...accumulatedData.detailedStats.d1,
            l1Members: [
              ...accumulatedData.detailedStats.d1.l1Members,
              ...response.data.detailedStats.d1.l1Members,
            ],
          },
          d2: {
            ...accumulatedData.detailedStats.d2,
            l1Members: [
              ...accumulatedData.detailedStats.d2.l1Members,
              ...response.data.detailedStats.d2.l1Members,
            ],
          },
        },
        // Keep overall stats and filtered stats from the latest response
        overallStats: response.data.overallStats,
        filteredStats: response.data.filteredStats,
      }

      setAccumulatedData(newAccumulatedData)
      setCurrentPage(nextPage)
      setHasMorePages(response.meta.pagination.page < response.meta.pagination.totalPages)

      // Update the main stats state with the latest response for consistency
      setStats({ loading: false, data: { ...response, data: newAccumulatedData } })
    } catch (error) {
      console.error("Failed to load more data:", error)
      setStats(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load more data"
      }))
    } finally {
      setLoadingMore(false)
    }
  }, [hasMorePages, loadingMore, accumulatedData, currentPage, api])

  // Intersection observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && hasMorePages && !loadingMore && accumulatedData) {
      loadMoreData()
    }
  }, [hasMorePages, loadingMore, accumulatedData, loadMoreData])

  // Setup intersection observer
  useEffect(() => {
    if (sentinelRef.current && accumulatedData) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      })

      if (sentinelRef.current) {
        observerRef.current.observe(sentinelRef.current)
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, accumulatedData])

  // Reset intersection observer when division changes
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
  }, [selectedDivision])

  const toggleL1Member = (memberId: string) => {
    const newExpanded = new Set(expandedL1)
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId)
      // Also collapse all L2 members under this L1
      setExpandedL2((prev) => {
        const newL2 = new Set(prev)
        newL2.delete(`${memberId}-l2`)
        return newL2
      })
    } else {
      newExpanded.add(memberId)
    }
    setExpandedL1(newExpanded)
  }

  const toggleL2Member = (l1MemberId: string) => {
    const l2Key = `${l1MemberId}-l2`
    const newExpanded = new Set(expandedL2)
    if (newExpanded.has(l2Key)) {
      newExpanded.delete(l2Key)
    } else {
      newExpanded.add(l2Key)
    }
    setExpandedL2(newExpanded)
  }

  const handleLogout = () => {
    // Clear the token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("scp_admin_token")
    }
    // Reset auth state
    setAdminToken("")
    // Redirect to login
    window.location.href = "/login"
  }

  // Redirect to login if no token (after auth check is complete)
  useEffect(() => {
    if (!isAuthChecking && !adminToken) {
      window.location.href = "/login"
    }
  }, [adminToken, isAuthChecking])

  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Checking authentication...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-lg">
            <Users className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Street Cause Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 border border-red-500 text-red-500  rounded-lg font-medium transition-colors duration-200 shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {/* Admin Stats */}
        <DataCard
          title={`${selectedDivision.toUpperCase()} Performance Overview`}
          loading={stats.loading}
          error={stats.error}
          divisionSelector={
            <div className="inline-flex bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-200 shadow-lg">
              <button
                onClick={() => setSelectedDivision("d1")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  selectedDivision === "d1"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                }`}
              >
                Division 1
              </button>
              <button
                onClick={() => setSelectedDivision("d2")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                  selectedDivision === "d2"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                }`}
              >
                Division 2
              </button>
            </div>
          }
        >
          {accumulatedData && (
            <AdminStatsDisplay
              data={accumulatedData}
              selectedDivision={selectedDivision}
              expandedL1={expandedL1}
              expandedL2={expandedL2}
              toggleL1Member={toggleL1Member}
              toggleL2Member={toggleL2Member}
              loadingMore={loadingMore}
              hasMorePages={hasMorePages}
              sentinelRef={sentinelRef}
            />
          )}
        </DataCard>
      </div>
    </div>
  )
}

function DataCard({
  title,
  loading,
  error,
  divisionSelector,
  children,
}: {
  title: string;
  loading?: boolean;
  error?: string;
  divisionSelector?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <div className="flex items-center gap-4">
          {divisionSelector}
          {loading && (
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading…</span>
            </div>
          )}
        </div>
      </div>
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

function AdminStatsDisplay({
  data,
  selectedDivision,
  expandedL1,
  expandedL2,
  toggleL1Member,
  toggleL2Member,
  loadingMore,
  hasMorePages,
  sentinelRef,
}: {
  data: AdminStatsData
  selectedDivision: Division
  expandedL1: Set<string>
  expandedL2: Set<string>
  toggleL1Member: (id: string) => void
  toggleL2Member: (id: string) => void
  loadingMore: boolean
  hasMorePages: boolean
  sentinelRef: React.RefObject<HTMLDivElement | null>
}) {
  const divisionStats = data.overallStats[selectedDivision]
  const detailedStats = data.detailedStats[selectedDivision]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Overall Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{divisionStats.memberStats.totalMembers}</div>
            </div>
            <div className="text-blue-100 font-medium">Total Members</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{divisionStats.eventSales.totalSales}</div>
            </div>
            <div className="text-green-100 font-medium">Total Sales</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">₹{divisionStats.eventSales.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="text-purple-100 font-medium">Total Revenue</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6">Member Type Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(data.filteredStats).map(([type, memberStats]) => (
            <div
              key={type}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg"
            >
              <div className="text-lg font-bold mb-4 uppercase text-slate-800 tracking-wide">
                {type} Members
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Count:</span>
                  <span className="font-bold text-xl text-slate-800">
                    {memberStats[selectedDivision].count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Revenue:</span>
                  <span className="font-bold text-green-600">
                    ₹{memberStats[selectedDivision].eventSales.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sales:</span>
                  <span className="font-bold text-blue-600">
                    {memberStats[selectedDivision].eventSales.totalSales}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          Member Hierarchy
        </h3>
        <div className="space-y-4">
          {detailedStats.l1Members.map((l1Member: L1Member) => (
            <div
              key={l1Member.id}
              className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
            >
              {/* L1 Member - Always visible, clickable */}
              <button
                onClick={() => toggleL1Member(l1Member.id.toString())}
                className="w-full p-4 text-left hover:bg-slate-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {expandedL1.has(l1Member.id.toString()) ? (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      )}
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">L1: {l1Member.name}</div>
                      <div className="text-sm text-slate-600">
                        {l1Member.affiliation} • {l1Member.roleName}
                      </div>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {l1Member.uniqueDandiyaId}
                  </span>
                </div>
              </button>

              {/* L2 Member - Shows when L1 is expanded */}
              {expandedL1.has(l1Member.id.toString()) && (
                <div className="border-t border-slate-200">
                  <button
                    onClick={() => toggleL2Member(l1Member.id.toString())}
                    className="w-full p-4 pl-12 text-left hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {expandedL2.has(`${l1Member.id.toString()}-l2`) ? (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          )}
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-medium text-slate-700">
                            L2: {l1Member.l2Member.name}
                          </div>
                          <div className="text-sm text-slate-600">
                            {l1Member.l2Member.affiliation}
                          </div>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {l1Member.l2Member.uniqueDandiyaId}
                      </span>
                    </div>
                  </button>

                  {/* L4 Member - Shows when L2 is expanded */}
                  {expandedL2.has(`${l1Member.id.toString()}-l2`) && (
                    <div className="border-t border-slate-200 bg-slate-25">
                      <div className="p-4 pl-20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <div>
                              <div className="font-medium text-slate-700">
                                L4: {l1Member.l2Member.l4Member.name}
                              </div>
                            </div>
                          </div>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {l1Member.l2Member.l4Member.uniqueDandiyaId}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading more members...</span>
              </div>
            </div>
          )}

          {/* Sentinel element for infinite scroll */}
          {hasMorePages && !loadingMore && (
            <div
              ref={sentinelRef}
              className="h-4"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  )
}



