export interface PaymentUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  isActive: boolean;
}

export interface Payment {
  _id: string;
  userId: PaymentUser;
  stripeCheckoutSessionId: string;
  tier: string;
  creditsAdded: number;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | string;
  verificationAttempts: number;
  nextCheckAt: string;
  verifiedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPaymentsResponse {
  success: boolean;
  data: {
    payments: Payment[];
    pagination: Pagination;
  };
}

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
  status?: string;
  tier?: string;
  search?: string;
}
