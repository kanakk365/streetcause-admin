import {
  TrendingUp,
  User,
  Heart,
} from "lucide-react";
import type {
  TransactionData,
} from "@/lib/types";

interface TransactionStatsDisplayProps {
  data: TransactionData;
}

export function TransactionStatsDisplay({
  data,
}: TransactionStatsDisplayProps) {
  // Calculate statistics
  const ticketsByMemberType = data.tickets.reduce((acc, ticket) => {
    if (!acc[ticket.memberType]) {
      acc[ticket.memberType] = { Normal: 0, VIP: 0, total: 0 };
    }
    acc[ticket.memberType][ticket.passType]++;
    acc[ticket.memberType].total++;
    return acc;
  }, {} as Record<string, { Normal: number; VIP: number; total: number }>);

  const donationsByMemberType = data.donations.reduce((acc, donation) => {
    if (!acc[donation.memberType]) {
      acc[donation.memberType] = { count: 0, amount: 0 };
    }
    acc[donation.memberType].count++;
    acc[donation.memberType].amount += donation.donationAmount;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const totalTickets = data.tickets.length;
  const totalDonations = data.donations.length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Overview Cards */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Transaction Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-primary to-accent p-4 sm:p-6 rounded-xl text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <User className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <div className="text-2xl sm:text-3xl font-bold">
                {totalTickets}
              </div>
            </div>
            <div className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              Total Tickets
            </div>
          </div>
          <div className="bg-gradient-to-br from-chart-1 to-chart-2 p-4 sm:p-6 rounded-xl text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
              <div className="text-2xl sm:text-3xl font-bold">
                {totalDonations}
              </div>
            </div>
            <div className="text-primary-foreground/80 font-medium text-sm sm:text-base">
              Total Donations
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Statistics by Member Type */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
          Ticket Sales by Members
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {["L1", "L2", "L4"].map((memberType) => {
            const stats = ticketsByMemberType[memberType] || {
              Normal: 0,
              VIP: 0,
              total: 0,
            };
            return (
              <div
                key={memberType}
                className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg"
              >
                <div className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase text-foreground tracking-wide">
                  {memberType} Members
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Normal:
                    </span>
                    <span className="font-bold text-lg sm:text-xl text-blue-600">
                      {stats.Normal}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      VIP:
                    </span>
                    <span className="font-bold text-lg sm:text-xl text-purple-600">
                      {stats.VIP}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted-foreground text-sm sm:text-base font-medium">
                      Total:
                    </span>
                    <span className="font-bold text-lg sm:text-xl text-foreground">
                      {stats.total}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donation Statistics by Member Type */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
          Donations by Members
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {["L1", "L2", "L4"].map((memberType) => {
            const stats = donationsByMemberType[memberType] || {
              count: 0,
              amount: 0,
            };
            return (
              <div
                key={memberType}
                className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-lg"
              >
                <div className="text-base sm:text-lg font-bold mb-3 sm:mb-4 uppercase text-foreground tracking-wide">
                  {memberType} Members
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Count:
                    </span>
                    <span className="font-bold text-lg sm:text-xl text-green-600">
                      {stats.count}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Amount:
                    </span>
                    <span className="font-bold text-lg sm:text-xl text-green-600">
                      ₹{stats.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
