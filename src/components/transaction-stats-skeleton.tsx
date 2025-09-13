export function TransactionStatsSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Cards Skeleton */}
      <div>
        <div className="h-6 sm:h-8 bg-muted rounded-lg mb-4 sm:mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted p-4 sm:p-6 rounded-xl shadow-lg animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted-foreground/20 rounded"></div>
                <div className="w-16 h-8 sm:w-20 sm:h-10 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="w-24 h-4 sm:w-32 sm:h-5 bg-muted-foreground/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Statistics by Member Type Skeleton */}
      <div>
        <div className="h-6 sm:h-8 bg-muted rounded-lg mb-4 sm:mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg animate-pulse">
              <div className="h-5 sm:h-6 bg-muted-foreground/20 rounded mb-3 sm:mb-4"></div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
                  <div className="w-8 h-6 sm:w-10 sm:h-8 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
                  <div className="w-8 h-6 sm:w-10 sm:h-8 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="w-10 h-4 bg-muted-foreground/20 rounded"></div>
                  <div className="w-8 h-6 sm:w-10 sm:h-8 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Statistics by Member Type Skeleton */}
      <div>
        <div className="h-6 sm:h-8 bg-muted rounded-lg mb-4 sm:mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg animate-pulse">
              <div className="h-5 sm:h-6 bg-muted-foreground/20 rounded mb-3 sm:mb-4"></div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
                  <div className="w-8 h-6 sm:w-10 sm:h-8 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-12 h-4 bg-muted-foreground/20 rounded"></div>
                  <div className="w-16 h-6 sm:w-20 sm:h-8 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="w-8 h-4 bg-muted-foreground/20 rounded"></div>
                  <div className="w-16 h-6 sm:w-20 sm:h-8 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
