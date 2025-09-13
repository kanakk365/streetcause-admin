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

// New Hierarchy Types
export interface HierarchyL1Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  uniqueDandiyaId: string;
  affiliation: string;
  roleName: string;
}

export interface HierarchyL2Member {
  id: number;
  name: string;
  phone: string;
  email: string;
  affiliation: string;
  uniqueDandiyaId: string;
  uniqueIDforL2: string;
  l1Members: HierarchyL1Member[];
}

export interface HierarchyL4Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  uniqueDandiyaId: string;
  l2Members: HierarchyL2Member[];
}

export interface HierarchyCounts {
  l1: number;
  l2: number;
  l4: number;
  total: number;
}

export interface HierarchyData {
  event: string;
  l4Members: HierarchyL4Member[];
  counts: HierarchyCounts;
}

export interface MemberHierarchyResponse {
  success: boolean;
  message: string;
  data: HierarchyData;
  meta: {
    timestamp: string;
  };
}

export interface MemberHierarchyQuery {
  event: "D1" | "D2";
}

// Transaction Types
export interface TicketTransaction {
  id: number;
  passId: string;
  passPurchaseName: string;
  mobileNumber: string;
  email: string;
  passType: "Normal" | "VIP";
  memberId: string;
  memberType: "L1" | "L2" | "L4";
  paymentMode: string;
  qrCode: string;
  amount: number | null;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DonationTransaction {
  id: number;
  donorId: string;
  name: string;
  mobileNumber: string;
  email: string;
  donationAmount: number;
  memberId: string;
  memberType: "L1" | "L2" | "L4";
  paymentMode: string;
  qrCode: string;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionData {
  event: string;
  tickets: TicketTransaction[];
  donations: DonationTransaction[];
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: TransactionData;
  meta: {
    timestamp: string;
  };
}

export interface TransactionQuery {
  event: "D1" | "D2";
}


