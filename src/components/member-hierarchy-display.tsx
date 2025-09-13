import {
  ChevronRight,
  ChevronDown,
  Users,
  TrendingUp,
  DollarSign,
  User,
} from "lucide-react";
import type {
  HierarchyData,
  HierarchyL4Member,
  HierarchyL2Member,
  HierarchyL1Member,
} from "@/lib/types";

interface MemberHierarchyDisplayProps {
  data: HierarchyData;
  expandedL4: Set<string>;
  expandedL2: Set<string>;
  toggleL4Member: (id: string) => void;
  toggleL2Member: (id: string) => void;
}

export function MemberHierarchyDisplay({
  data,
  expandedL4,
  expandedL2,
  toggleL4Member,
  toggleL2Member,
}: MemberHierarchyDisplayProps) {
  return (
    <div className="space-y-6 sm:space-y-8 mt-10 ">
      {/* Hierarchy Overview */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Members Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
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
          <div className="bg-gradient-to-br from-chart-4 to-chart-3 p-4 sm:p-6 rounded-xl text-primary-foreground shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <div className="text-2xl sm:text-3xl font-bold">
                {data.counts.total}
              </div>
            </div>
            <div className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              Total Members
            </div>
          </div>
        </div>
      </div>

      {/* Member Hierarchy Tree */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Member Hierarchy ({data.event})
        </h3>
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
  );
}
