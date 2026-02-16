export interface User {
  userId: string;
  email: string;
  createdAt: string;
  tokens?: Token[];
}

export type PlanType = "starter" | "professional" | "enterprise";

export type TokenStatus = "active" | "expired" | "revoked" | "used";

export interface Token {
  tokenCode: string;
  planType: PlanType;
  expirationDate: string;
  status: TokenStatus;
  createdAt: string;
  userId?: string;
  metadata?: TokenMetadata;
}

export interface TokenMetadata {
  planType: PlanType;
  expirationDate: string;
  userEmail: string;
  allowedFeatures: string[];
  limits: {
    stores: number | "unlimited";
    photos: number | "unlimited";
    apiCalls: number | "unlimited";
    users: number | "unlimited";
  };
  usageTracking?: {
    apiCallsUsed: number;
    photosProcessed: number;
    lastUsed: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  features: string[];
  price: {
    monthly: number;
    yearly: number;
  };
  limits: {
    stores: number | "unlimited";
    photos: number | "unlimited";
    apiCalls: number | "unlimited";
    users: number | "unlimited";
  };
}

export interface FeatureAccess {
  featureName: string;
  limit: number | "unlimited";
  planId: string;
}

export type FeatureName =
  | "auto-bookkeeping"
  | "photo-enhancer"
  | "label-generator"
  | "whatsapp-ai"
  | "analytics"
  | "multi-store"
  | "api-access"
  | "custom-training"
  | "team-roles";

export interface PaymentRecord {
  recordId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  date: string;
  stripeSessionId?: string;
  planType: PlanType;
  billingCycle: "monthly" | "yearly";
}
export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  planName?: string;
  planType?: PlanType;
  expiresAt?: string;
  features?: string[];
  limits?: {
    stores: number | "unlimited";
    photos: number | "unlimited";
    apiCalls: number | "unlimited";
    users: number | "unlimited";
  };
  error?: string;
}

export interface CreateCheckoutRequest {
  planId: PlanType;
  email: string;
  billingCycle: "monthly" | "yearly";
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface GenerateTokenRequest {
  orderId: string;
  planId: PlanType;
  email: string;
  billingCycle: "monthly" | "yearly";
}

export interface GenerateTokenResponse {
  token: string;
  expiresAt: string;
  planType: PlanType;
}

export interface StripeWebhookPayload {
  event: string;
  data: {
    object: {
      id: string;
      customer_email: string;
      amount_total: number;
      currency: string;
      metadata: {
        planType: PlanType;
        billingCycle: "monthly" | "yearly";
      };
    };
  };
}

export interface UserSession {
  token: string;
  planType: PlanType;
  planName: string;
  expiresAt: string;
  features: string[];
  limits: {
    stores: number | "unlimited";
    photos: number | "unlimited";
    apiCalls: number | "unlimited";
    users: number | "unlimited";
  };
  sessionStarted: string;
}

export interface ApiError {
  error: string;
  code: string;
  message: string;
  statusCode: number;
}

export const ErrorCodes = {
  INVALID_TOKEN: "INVALID_TOKEN",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  REVOKED_TOKEN: "REVOKED_TOKEN",
  TOKEN_NOT_FOUND: "TOKEN_NOT_FOUND",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  INVALID_PLAN: "INVALID_PLAN",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;