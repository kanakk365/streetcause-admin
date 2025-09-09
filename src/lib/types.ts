export type Division = "d1" | "d2";

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: {
      id: number;
      username: string;
      email: string;
      role: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
  meta: {
    timestamp: string;
  };
}

export interface AdminStatsQuery {
  page?: number;
  limit?: number;
}


export interface DetailedSale {
  memberId: string;
  memberName: string;
  memberType: string;
  affiliation: string;
  uniqueDandiyaId: string;
  normalPasses: number;
  vipPasses: number;
  donations: number;
  totalAmount: number;
}

export interface MemberStats {
  l1Count: number;
  l2Count: number;
  l4Count: number;
  totalMembers: number;
}

export interface EventSales {
  normalPassSales: number;
  vipPassSales: number;
  donationSales: number;
  totalSales: number;
  totalRevenue: number;
}

export interface DivisionStats {
  memberStats: MemberStats;
  eventSales: EventSales;
  detailedSales: DetailedSale[];
}

export interface L1Member {
  id: number;
  name: string;
  email: string;
  uniqueDandiyaId: string;
  affiliation: string;
  roleName: string;
  l2Member: {
    id: number;
    name: string;
    uniqueDandiyaId: string;
    affiliation: string;
    l4Member: {
      id: number;
      name: string;
      uniqueDandiyaId: string;
    };
  };
}

export interface DetailedDivisionStats {
  l1Count: number;
  l2Count: number;
  l4Count: number;
  totalMembers: number;
  l1Members: L1Member[];
}

export interface FilteredStatsItem {
  memberType: string;
  d1: {
    count: number;
    eventSales: EventSales;
  };
  d2: {
    count: number;
    eventSales: EventSales;
  };
}

export interface AdminStatsData {
  overallStats: {
    d1: DivisionStats;
    d2: DivisionStats;
  };
  detailedStats: {
    d1: DetailedDivisionStats;
    d2: DetailedDivisionStats;
  };
  filteredStats: {
    l1: FilteredStatsItem;
    l2: FilteredStatsItem;
    l4: FilteredStatsItem;
  };
}

export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: AdminStatsData;
  meta: {
    timestamp: string;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}


