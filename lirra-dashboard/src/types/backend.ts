/**
 * Backend Type Definitions for Lirra Token-Based Access System
 * Based on the architecture specifications and class diagram
 */

// ==================== User Types ====================

export interface User {
  userId: string;
  email: string;
  createdAt: string;
  tokens?: Token[];
}

// ==================== Token Types ====================

export type PlanType = "starter" | "professional" | "enterprise";

export type TokenStatus = "active" | "expired" | "revoked" | "used";

export interface Token {
  tokenCode: string;
  planType: PlanType;
  expirationDate: string; // ISO date string
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

// ==================== Plan Types ====================

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

// ==================== Feature Access Types ====================

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

// ==================== Payment Types ====================

export interface PaymentRecord {
  recordId: string;
  userId: string;
  amount: number; // in USD
  currency: string; // "USD"
  status: "pending" | "completed" | "failed" | "refunded";
  date: string;
  stripeSessionId?: string;
  planType: PlanType;
  billingCycle: "monthly" | "yearly";
}

// ==================== API Request/Response Types ====================

// Token Validation
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

// Checkout Creation
export interface CreateCheckoutRequest {
  planId: PlanType;
  email: string;
  billingCycle: "monthly" | "yearly";
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

// Token Generation
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

// Webhook Payload
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

// ==================== Session Types ====================

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

// ==================== Error Types ====================

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
