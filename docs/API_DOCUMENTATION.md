# Lirra Backend API Documentation

## Overview

This document outlines the backend API structure for the Lirra token-based authentication system. All APIs should be implemented as serverless functions (e.g., Vercel Functions, AWS Lambda, Supabase Edge Functions).

## Base URL

```
Production: https://api.lirra.app
Development: http://localhost:3000
```

## Authentication

- Token validation endpoint: Public (no auth required)
- Admin endpoints: Require API key in `X-API-Key` header
- Webhook endpoints: Verify Stripe signature

---

## 1. Token Validation API

### POST `/api/token/validate`

Validates a credential token and returns plan details.

**Request Body:**

```json
{
  "token": "LIRRA-XXXX-XXXX-XXXX-XXXX"
}
```

**Success Response (200):**

```json
{
  "valid": true,
  "planName": "Professional",
  "planType": "professional",
  "expiresAt": "2025-01-08T00:00:00.000Z",
  "features": [
    "Multi-store management",
    "Advanced analytics",
    "WhatsApp AI",
    "Label generator",
    "Photo enhancer"
  ],
  "limits": {
    "stores": 3,
    "photos": "unlimited",
    "apiCalls": 10000,
    "users": 3
  }
}
```

**Error Response (400/404):**

```json
{
  "valid": false,
  "error": "INVALID_TOKEN",
  "message": "Token not found or invalid"
}
```

**Implementation Notes:**

- Hash the incoming token using SHA-256
- Query database for hashed token
- Check expiration date
- Check status (active/expired/revoked)
- Return plan metadata
- Log validation attempt with IP for security

**Security:**

- Rate limit: 10 requests per IP per minute
- Log all validation attempts
- Never return raw tokens in response

---

## 2. Checkout Creation API

### POST `/api/checkout/create`

Creates a Stripe checkout session for plan purchase.

**Request Body:**

```json
{
  "planId": "professional",
  "email": "customer@example.com",
  "billingCycle": "monthly"
}
```

**Success Response (200):**

```json
{
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_...",
  "sessionId": "cs_test_a1b2c3d4e5f6"
}
```

**Implementation Notes:**

- Validate planId against allowed plans
- Create Stripe checkout session
- Set success_url to PaymentSuccess page
- Set cancel_url to pricing page
- Include metadata: { planType, billingCycle, email }
- Return checkout URL for redirect

---

## 3. Payment Webhook API

### POST `/api/webhook/payment`

Handles Stripe webhook events for payment completion.

**Headers:**

```
stripe-signature: t=1234567890,v1=abc123...
```

**Request Body:** (Stripe event payload)

**Success Response (200):**

```json
{
  "received": true
}
```

**Implementation Flow:**

1. Verify Stripe signature
2. Parse event type
3. If `checkout.session.completed`:
   - Extract customer email and metadata
   - Generate credential token
   - Store token in database (hashed)
   - Send email with token
   - Create payment record
4. Return 200 status

**Implementation Notes:**

- Use Stripe webhook signature verification
- Handle idempotency (check if token already generated)
- Retry logic for email sending
- Log all webhook events

---

## 4. Token Generation API

### POST `/api/tokens/generate`

Generates a new credential token (called by webhook handler).

**Request Body:**

```json
{
  "orderId": "order_123",
  "planId": "professional",
  "email": "customer@example.com",
  "billingCycle": "monthly"
}
```

**Success Response (200):**

```json
{
  "token": "LIRRA-AB12-CD34-EF56-GH78",
  "expiresAt": "2025-01-08T00:00:00.000Z",
  "planType": "professional"
}
```

**Implementation Notes:**

- Generate random token: `LIRRA-XXXX-XXXX-XXXX-XXXX`
- Calculate expiration (30 days for monthly, 365 for yearly)
- Hash token with SHA-256
- Store hashed token in database
- Return plain token (only time it's visible)
- Send email with token to customer

**Token Format:**

- Pattern: `LIRRA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}`
- Example: `LIRRA-AB12-CD34-EF56-GH78`
- 20 characters + hyphens = high entropy

---

## 5. Token Revocation API (Admin)

### POST `/api/admin/tokens/revoke`

Revokes a token (admin only).

**Headers:**

```
X-API-Key: admin_secret_key
```

**Request Body:**

```json
{
  "token": "LIRRA-XXXX-XXXX-XXXX-XXXX"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token revoked successfully"
}
```

---

## Database Schema

### Table: `tokens`

```sql
CREATE TABLE tokens (
  token_hash VARCHAR(64) PRIMARY KEY,  -- SHA-256 hash
  plan_type VARCHAR(20) NOT NULL,      -- starter/professional/enterprise
  user_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active/expired/revoked
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  metadata JSONB,                      -- plan limits, features, etc.
  last_used_at TIMESTAMP
);

CREATE INDEX idx_email ON tokens(user_email);
CREATE INDEX idx_status ON tokens(status);
CREATE INDEX idx_expires ON tokens(expires_at);
```

### Table: `payment_records`

```sql
CREATE TABLE payment_records (
  record_id VARCHAR(50) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL,
  plan_type VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(10) NOT NULL,
  stripe_session_id VARCHAR(255),
  token_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (token_hash) REFERENCES tokens(token_hash)
);
```

---

## Email Templates (We Haven't implement till here yet)

### Token Delivery Email

**Subject:** Your Lirra Credential Key - {Plan Name} Access

**Body:**

```
Hi there,

Thank you for your purchase! Your Lirra dashboard is now ready.

Your Credential Key:
━━━━━━━━━━━━━━━━━━━━━━
LIRRA-XXXX-XXXX-XXXX-XXXX
━━━━━━━━━━━━━━━━━━━━━━

Plan: {Plan Name}
Valid Until: {Expiration Date}

Next Steps:
1. Visit: https://dashboard.lirra.app
2. Enter your credential key
3. Start automating your business

Keep this key safe - you'll need it to access your dashboard.

Need help? Reply to this email.

Best regards,
Lirra Team
```

---

## Security Checklist

- [ ] Always hash tokens before storing (SHA-256)
- [ ] Never log plain tokens
- [ ] Use HTTPS for all endpoints
- [ ] Implement rate limiting
- [ ] Verify Stripe webhook signatures
- [ ] Validate all input data
- [ ] Set CORS headers appropriately
- [ ] Use environment variables for secrets
- [ ] Implement request logging
- [ ] Add monitoring and alerting

---

## Deployment Guide

### Vercel Functions Example

```typescript
// api/token/validate.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      valid: false,
      error: "Token is required",
    });
  }

  // Hash the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Query Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from("tokens")
    .select("*")
    .eq("token_hash", hashedToken)
    .single();

  if (error || !data) {
    return res.status(404).json({
      valid: false,
      error: "INVALID_TOKEN",
      message: "Token not found",
    });
  }

  // Check expiration
  if (new Date(data.expires_at) < new Date()) {
    return res.status(400).json({
      valid: false,
      error: "EXPIRED_TOKEN",
      message: "Token has expired",
    });
  }

  // Check status
  if (data.status !== "active") {
    return res.status(400).json({
      valid: false,
      error: "REVOKED_TOKEN",
      message: "Token has been revoked",
    });
  }

  // Return success
  return res.status(200).json({
    valid: true,
    planType: data.plan_type,
    planName: data.plan_type.charAt(0).toUpperCase() + data.plan_type.slice(1),
    expiresAt: data.expires_at,
    features: data.metadata.features,
    limits: data.metadata.limits,
  });
}
```

---

## Environment Variables

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Email (Resend, SendGrid, etc.)
EMAIL_API_KEY=re_xxx
EMAIL_FROM=noreply@lirra.app

# App URLs
LANDING_URL=https://lirra.app
DASHBOARD_URL=https://dashboard.lirra.app

# Admin
ADMIN_API_KEY=admin_secret_xxx
```

---

## Testing

### Test Token Validation

```bash
curl -X POST https://api.lirra.app/api/token/validate \
  -H "Content-Type: application/json" \
  -d '{"token": "LIRRA-TEST-1234-5678-ABCD"}'
```

### Test Checkout Creation

```bash
curl -X POST https://api.lirra.app/api/checkout/create \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "professional",
    "email": "test@example.com",
    "billingCycle": "monthly"
  }'
```

---

## Monitoring Metrics

Track these metrics:

- Token validation requests per minute
- Failed validation attempts by IP
- Successful payments per plan
- Token redemption time (purchase to first use)
- Average session duration
- API response times
- Error rates by endpoint
