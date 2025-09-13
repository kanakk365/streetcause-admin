export function MemberHierarchySkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 mt-10">
      {/* Hierarchy Overview Skeleton */}
      <div>
        <div className="h-6 sm:h-8 bg-muted rounded-lg mb-4 sm:mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted p-4 sm:p-6 rounded-xl shadow-lg animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted-foreground/20 rounded"></div>
                <div className="w-16 h-8 sm:w-20 sm:h-10 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="w-20 h-4 sm:w-24 sm:h-5 bg-muted-foreground/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Hierarchy Tree Skeleton */}
      <div>
        <div className="h-6 sm:h-8 bg-muted rounded-lg mb-4 sm:mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-muted/50 rounded-xl border border-border overflow-hidden animate-pulse"
            >
              {/* L4 Member Skeleton */}
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted-foreground/20 rounded"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-muted-foreground/20 rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="w-32 h-4 sm:w-40 sm:h-5 bg-muted-foreground/20 rounded"></div>
                      <div className="w-48 h-3 sm:w-56 sm:h-4 bg-muted-foreground/20 rounded"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 sm:w-24 sm:h-7 bg-muted-foreground/20 rounded-full self-start sm:self-center"></div>
                </div>
              </div>

              {/* L2 Members Skeleton - Show some as expanded */}
              {i % 2 === 0 && (
                <div className="border-t border-border">
                  {[...Array(3)].map((_, j) => (
                    <div key={j}>
                      <div className="p-3 sm:p-4 pl-8 sm:pl-12">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
                              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-muted-foreground/20 rounded-full"></div>
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="w-28 h-4 sm:w-36 sm:h-5 bg-muted-foreground/20 rounded"></div>
                              <div className="w-40 h-3 sm:w-48 sm:h-4 bg-muted-foreground/20 rounded"></div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 self-start sm:self-center">
                            <div className="w-16 h-6 sm:w-20 sm:h-7 bg-muted-foreground/20 rounded-full"></div>
                            <div className="w-12 h-6 sm:w-16 sm:h-7 bg-muted-foreground/20 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* L1 Members Skeleton - Show some as expanded */}
                      {j % 2 === 0 && (
                        <div className="border-t border-border bg-muted/25">
                          {[...Array(4)].map((_, k) => (
                            <div key={k} className="p-3 sm:p-4 pl-12 sm:pl-20">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/20 rounded-full"></div>
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="w-24 h-4 sm:w-32 sm:h-5 bg-muted-foreground/20 rounded"></div>
                                    <div className="w-36 h-3 sm:w-44 sm:h-4 bg-muted-foreground/20 rounded"></div>
                                    <div className="w-40 h-3 bg-muted-foreground/20 rounded"></div>
                                  </div>
                                </div>
                                <div className="w-16 h-6 sm:w-20 sm:h-7 bg-muted-foreground/20 rounded-full self-start sm:self-center"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
