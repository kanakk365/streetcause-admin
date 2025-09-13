import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Users,
  User,
  Ticket,
  Heart,
  Crown,
} from "lucide-react";
import type {
  HierarchyData,
  HierarchyL4Member,
  HierarchyL2Member,
  HierarchyL1Member,
  TransactionData,
} from "@/lib/types";

interface MemberHierarchyDisplayProps {
  data: HierarchyData;
  transactionData?: TransactionData;
  expandedL4: Set<string>;
  expandedL2: Set<string>;
  isExpanded: boolean;
  toggleL4Member: (id: string) => void;
  toggleL2Member: (id: string) => void;
  toggleSection: () => void;
}

export function MemberHierarchyDisplay({
  data,
  transactionData,
  expandedL4,
  expandedL2,
  isExpanded,
  toggleL4Member,
  toggleL2Member,
  toggleSection,
}: MemberHierarchyDisplayProps) {
  // State for single member type selection with sub-filters
  const [selectedMemberType, setSelectedMemberType] = useState<'L4' | 'L2' | 'L1' | null>('L4');
  const [subFilters, setSubFilters] = useState({
    normal: true,
    vip: true,
    donations: true
  });

  // Select a member type (only one at a time)
  const selectMemberType = (memberType: 'L4' | 'L2' | 'L1') => {
    setSelectedMemberType(memberType);
  };

  // Toggle sub-filter
  const toggleSubFilter = (filterType: 'normal' | 'vip' | 'donations') => {
    setSubFilters(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  // Get filtered transactions
  const getFilteredTransactions = () => {
    if (!transactionData) return { tickets: [], donations: [] };

    const filteredTickets = transactionData.tickets.filter(ticket => {
      if (ticket.memberType !== selectedMemberType) return false;

      if (ticket.passType === 'Normal' && subFilters.normal) return true;
      if (ticket.passType === 'VIP' && subFilters.vip) return true;
      return false;
    });

    const filteredDonations = transactionData.donations.filter(donation => {
      if (donation.memberType !== selectedMemberType) return false;
      return subFilters.donations;
    });

    return {
      tickets: filteredTickets,
      donations: filteredDonations
    };
  };

  const filteredTransactions = getFilteredTransactions();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalItems = filteredTransactions.tickets.length + filteredTransactions.donations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Get paginated transactions
  const getPaginatedTransactions = () => {
    const allTransactions = [
      ...filteredTransactions.tickets.map(ticket => ({ ...ticket, type: 'ticket' as const })),
      ...filteredTransactions.donations.map(donation => ({ ...donation, type: 'donation' as const }))
    ];

    return allTransactions.slice(startIndex, startIndex + itemsPerPage);
  };

  const paginatedTransactions = getPaginatedTransactions();

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedMemberType, subFilters]);

  return (
    <div className="space-y-6 sm:space-y-8 mt-10 ">
      {/* Hierarchy Overview */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Members Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-primary to-accent p-4 sm:p-6 rounded-xl text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <div className="text-2xl sm:text-3xl font-bold">
                {data.counts.l4}
              </div>
            </div>
            <div className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              L4 Members
            </div>
          </div>
          <div className="bg-gradient-to-br from-chart-1 to-chart-2 p-4 sm:p-6 rounded-xl text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <User className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <div className="text-2xl sm:text-3xl font-bold">
                {data.counts.l2}
              </div>
            </div>
            <div className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              L2 Members
            </div>
          </div>
          <div className="bg-gradient-to-br from-chart-2 to-chart-4 p-4 sm:p-6 rounded-xl text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <User className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <div className="text-2xl sm:text-3xl font-bold">
                {data.counts.l1}
              </div>
            </div>
            <div className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              L1 Members
            </div>
          </div>
        </div>
      </div>

      {/* Member Hierarchy Tree */}
      <div>
        <button
          onClick={toggleSection}
          className="w-full text-left group cursor-pointer"
        >
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center justify-between hover:text-primary transition-colors duration-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Member Hierarchy ({data.event})
            </div>
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              ) : (
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              )}
            </div>
          </h3>
        </button>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-4">
          {data.l4Members.map((l4Member: HierarchyL4Member) => (
            <div
              key={l4Member.id}
              className="bg-muted/50 rounded-xl border border-border overflow-hidden"
            >
              {/* L4 Member - Top level, always visible, clickable */}
              <button
                onClick={() => toggleL4Member(l4Member.id.toString())}
                className="w-full p-3 sm:p-4 text-left hover:bg-muted transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      {expandedL4.has(l4Member.id.toString()) ? (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      )}
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground text-sm sm:text-base truncate">
                        L4: {l4Member.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {l4Member.email} • {l4Member.phone}
                      </div>
                    </div>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium self-start sm:self-center">
                    {l4Member.uniqueDandiyaId}
                  </span>
                </div>
              </button>

              {/* L2 Members - Show when L4 is expanded */}
              {expandedL4.has(l4Member.id.toString()) && (
                <div className="border-t border-border">
                  {l4Member.l2Members.map((l2Member: HierarchyL2Member) => (
                    <div key={l2Member.id}>
                      <button
                        onClick={() =>
                          toggleL2Member(`${l4Member.id}-${l2Member.id}`)
                        }
                        className="w-full p-3 sm:p-4 pl-8 sm:pl-12 text-left hover:bg-muted transition-colors duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2">
                              {expandedL2.has(
                                `${l4Member.id}-${l2Member.id}`
                              ) ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-chart-3 rounded-full"></div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-foreground text-sm sm:text-base truncate">
                                L2: {l2Member.name}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                {l2Member.affiliation} • {l2Member.phone}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 self-start sm:self-center">
                            <span className="bg-chart-3/10 text-chart-3 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                              {l2Member.uniqueDandiyaId}
                            </span>
                            <span className="bg-muted text-muted-foreground px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                              {l2Member.l1Members.length} L1
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* L1 Members - Show when L2 is expanded */}
                      {expandedL2.has(`${l4Member.id}-${l2Member.id}`) && (
                        <div className="border-t border-border bg-muted/25">
                          {l2Member.l1Members.map(
                            (l1Member: HierarchyL1Member) => (
                              <div
                                key={l1Member.id}
                                className="p-3 sm:p-4 pl-12 sm:pl-20"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-2 rounded-full"></div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-foreground text-sm sm:text-base truncate">
                                        L1: {l1Member.name}
                                      </div>
                                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                        {l1Member.affiliation} •{" "}
                                        {l1Member.roleName}
                                      </div>
                                      <div className="text-xs text-muted-foreground truncate">
                                        {l1Member.email} • {l1Member.phone}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="bg-chart-2/10 text-chart-2 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium self-start sm:self-center">
                                    {l1Member.uniqueDandiyaId}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {data.l4Members.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No members found for {data.event}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Transactions Table */}
      {transactionData && (
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Transaction Summary
          </h3>

          {/* Member Type Selection with Sub-filters */}
          <div className="space-y-4 mb-6">
            {/* Member Type Selection */}
            <div className="flex flex-wrap gap-3">
              {(['L4', 'L2', 'L1'] as const).map((memberType) => (
                <button
                  key={memberType}
                  onClick={() => selectMemberType(memberType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    selectedMemberType === memberType
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {memberType === 'L4' && <Users className="w-4 h-4" />}
                  {memberType === 'L2' && <User className="w-4 h-4" />}
                  {memberType === 'L1' && <User className="w-4 h-4" />}
                  {memberType} Members
                </button>
              ))}
            </div>

            {/* Sub-filters for selected member type */}
            {selectedMemberType && (
              <div className="bg-card/50 rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Filter {selectedMemberType} transactions:
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleSubFilter('normal')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      subFilters.normal
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Ticket className="w-4 h-4" />
                    Normal Tickets
                  </button>
                  <button
                    onClick={() => toggleSubFilter('vip')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      subFilters.vip
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    VIP Tickets
                  </button>
                  <button
                    onClick={() => toggleSubFilter('donations')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      subFilters.donations
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Donations
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transactions Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Mobile</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Member Type</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Payment Mode</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">QR Code</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Paginated Transactions */}
                  {paginatedTransactions.map((transaction) => (
                    <tr key={`${transaction.type}-${transaction.id}`} className="hover:bg-muted/50 transition-colors duration-200">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'ticket' ? (
                            'passType' in transaction && transaction.passType === 'VIP' ? (
                              <Crown className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Ticket className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <Heart className="w-4 h-4 text-green-600" />
                          )}
                          <span className="font-mono text-sm text-foreground">
                            {transaction.type === 'ticket' && 'passId' in transaction
                              ? transaction.passId
                              : transaction.type === 'donation' && 'donorId' in transaction
                              ? transaction.donorId
                              : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">
                          {transaction.type === 'ticket' && 'passPurchaseName' in transaction
                            ? transaction.passPurchaseName
                            : transaction.type === 'donation' && 'name' in transaction
                            ? transaction.name
                            : ''}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground font-mono">{transaction.mobileNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.memberType === 'L4'
                            ? 'bg-red-100 text-red-800'
                            : transaction.memberType === 'L2'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.memberType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.paymentMode === 'UPI'
                            ? 'bg-green-100 text-green-800'
                            : transaction.paymentMode === 'Card'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.paymentMode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground font-mono break-all">{transaction.qrCode}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'created'
                            ? 'bg-yellow-100 text-yellow-800'
                            : transaction.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Empty state */}
                  {totalItems === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No transactions found for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Showing {Math.min(startIndex + 1, totalItems)} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} transactions
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-muted-foreground">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors cursor-pointer ${
                          currentPage === totalPages
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
