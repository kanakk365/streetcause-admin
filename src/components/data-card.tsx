import type React from "react";

interface DataCardProps {
  title: string;
  loading?: boolean;
  error?: string;
  divisionSelector?: React.ReactNode;
  children: React.ReactNode;
}

export function DataCard({
  title,
  loading,
  error,
  divisionSelector,
  children,
}: DataCardProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {divisionSelector}
          {loading && (
            <div className="flex items-center gap-2 text-primary">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading…</span>
            </div>
          )}
        </div>
      </div>
      {error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 sm:p-4 text-destructive text-sm sm:text-base">
          {error}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
