export interface Subscription {
  _id: string;
  stripeCustomerId?: string;
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  lastPaymentId?: string;
  lastPaymentStatus?: string;
  lastPaymentAmount: number;
  lastPaymentCurrency: string;
  currentTier: string;
  isActive: boolean;
  lastCronCheckAt?: string;
  paymentVerifiedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string | null;
  jobTitle?: string | null;
  isVerified: boolean;
  imageLink: string | null;
  role: string;
  isActive: boolean;
  address?: string | null;
  subscriptionId: Subscription | null;
  totalCreditsEverUsed: number;
  lastPurchaseAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserByIdResponse {
  success: boolean;
  data: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean | string;
}

export interface UserPayment {
  _id: string;
  userId: string;
  stripeCheckoutSessionId: string;
  tier: string;
  creditsAdded: number;
  amount: number;
  currency: string;
  status: string;
  verificationAttempts: number;
  nextCheckAt: string;
  verifiedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserPaymentsResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      isVerified: boolean;
      role: string;
      isActive: boolean;
    };
    payments: UserPayment[];
    pagination: Pagination;
  };
}
