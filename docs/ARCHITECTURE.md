# Lirra System Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Pricing Model](#pricing-model)
3. [Token-Based Access Architecture](#token-based-access-architecture)
4. [Use Cases](#use-cases)
5. [Activity Diagrams](#activity-diagrams)
6. [Sequence Diagrams](#sequence-diagrams)
7. [Class Diagrams](#class-diagrams)
8. [System Components](#system-components)

 

## 1. Overview

Lirra is a pay-to-access automation dashboard designed for Indonesian UMKM (small businesses). The system uses a **token-based credential flow** instead of traditional account sign-up, reducing friction and making it easy for non-tech-savvy business owners to get started.

### Core Principle

> Users buy a time-limited or quota-based credential key from the landing page and redeem that key on the dashboard to unlock features.

### Why Token-Based Access?

1. **Minimal Friction**: No sign-up forms, password creation, or email verification
2. **Familiar Pattern**: Works like voucher codes common in Indonesian marketplaces
3. **Instant Access**: Purchase → Get Token → Use Dashboard (3 steps)
4. **UMKM-Friendly**: Suits the digital voucher model popular with small businesses
5. **Flexible Distribution**: Tokens can be sold through partners, resellers, or directly

 

## 2. Pricing Model for UMKM Users

The pricing system is simple, affordable, and easy for small businesses to understand. Three tiers offer a clear upgrade path.

### Starter Plan

**Target**: Small single owner shops  
**Price**: $7/month (~100,000 IDR)

**Includes:**

- Auto Bookkeeping (basic)
- Photo enhancer (single file processing)
- Basic WhatsApp AI reply
- One store only
- Limited analytics
- Email support

**Ideal for**: Food stalls, small sellers, home business

 

### Professional Plan (Recommended)

**Target**: Growing UMKM with 1-3 staff  
**Price**: $20/month (~300,000 IDR)

**Includes everything in Starter plus:**

- Unlimited photo enhancement
- Multi-store support (up to 3 stores)
- Auto packaging label generator
- Full analytics dashboard
- WhatsApp integration with templates
- Priority support

**Ideal for**: Boutiques, cafes, online sellers on Shopee and Tokopedia

 

### Enterprise Plan

**Target**: Medium scale stores or agencies  
**Price**: $49/month (~750,000 IDR)

**Includes everything in Professional plus:**

- Team roles & permissions
- Custom AI reply training
- API access
- Large file processing
- Dedicated support staff
- Custom workflow automations
- Unlimited stores

**Ideal for**: Agencies, multi-outlet brands, large ecommerce sellers

 

## 3. Token-Based Access Architecture

### How Token-Based Access Fits the Pricing

The token system acts as the access gate to the dashboard.

**Flow:**

1. User chooses Starter, Professional, or Enterprise on the landing page
2. Once payment is complete, backend generates a unique credential token
3. Token is given to the user (via email and success page)
4. User goes to Lirra dashboard and inputs the token
5. Backend checks plan type and enables features
6. Dashboard unlocks according to the purchased plan

### Token Metadata

Each token carries:

- **Plan type** (starter/professional/enterprise)
- **Expiration date** (30 days for monthly, 365 for yearly)
- **User email** (for support and recovery)
- **Allowed features** (list of enabled features)
- **Usage limits** (stores, photos, API calls, users)

### Token Security

- Tokens are **hashed using SHA-256** before storage
- Only the hash is stored in the database
- Plain token is **never stored**, only shown once to user
- Rate limiting prevents brute force attempts
- All validation attempts are logged with IP addresses

 

## 4. Use Cases

### Use Case 1: Redeem Credential Token and Unlock Dashboard

**Use Case Name**: Redeem Credential Token and Unlock Dashboard

**Primary Actor**: UMKM user who has purchased a subscription

**Goal**: Enable the user to access dashboard features based on their plan

**Scope**: Lirra SaaS Platform

**Level**: User goal level

**Preconditions**:

- User has completed payment
- System has generated a valid credential token
- User has the token ready (from email or success page)

**Success Guarantee**: User sees full dashboard features based on their plan

**Main Success Scenario**:

1. User opens the dashboard homepage
2. System displays one input field asking for credential token
3. User enters the token
4. Dashboard sends token to backend for validation
5. Backend checks token in the database (hashed)
6. Backend verifies plan type and expiration
7. Backend returns success response with user access details
8. Dashboard loads all features allowed by the plan
9. User can now use all tools inside Lirra

**Extensions**:

- **3a. Invalid token**

  - System displays error: "Token not recognized"
  - Return to step 2

- **6a. Expired token**

  - System displays error: "Subscription expired, please renew"
  - Offer link to purchase new plan

- **6b. Revoked token**

  - System displays error: "This token has been deactivated"
  - Contact support message shown

- **7a. Plan mismatch**
  - System loads restricted version and shows alert
  - Displays upgrade options

 

### Use Case 2: Purchase Plan and Receive Token

**Primary Actor**: Potential customer (UMKM owner)

**Goal**: Buy a subscription plan and receive access credentials

**Preconditions**:

- User is on the landing page pricing section
- Payment gateway (Stripe) is operational

**Main Success Scenario**:

1. User views pricing plans
2. User selects a plan (Starter/Professional/Enterprise)
3. User clicks "Get Started" button
4. System redirects to Stripe checkout
5. User enters payment details and email
6. User completes payment
7. Stripe sends webhook to backend
8. Backend generates unique credential token
9. Backend sends email with token to user
10. System redirects to PaymentSuccess page
11. Page displays the credential token
12. User saves token or opens email

**Extensions**:

- **6a. Payment fails**

  - Stripe shows error message
  - User can retry or use different payment method

- **8a. Email delivery fails**
  - Token still shown on success page
  - System retries email delivery
  - User can request resend from support

 

### Use Case 3: Use Dashboard Features

**Primary Actor**: Authenticated user (has redeemed token)

**Goal**: Access and use dashboard automation tools

**Preconditions**:

- User has successfully redeemed token
- Session is active in browser

**Main Success Scenario**:

1. User is logged into dashboard
2. Dashboard displays available features based on plan
3. User selects a feature (e.g., Photo Enhancer)
4. System checks feature access permissions
5. System allows access and loads feature
6. User performs actions (upload photo, generate label, etc.)
7. System processes request
8. System updates usage quota (if applicable)
9. User sees results

**Extensions**:

- **4a. Feature not included in plan**

  - System shows upgrade modal
  - User can purchase higher plan

- **8a. Quota exceeded**
  - System shows quota limit message
  - User can upgrade plan or wait for reset



## 5. Activity Diagrams (Text Form)

### Activity Diagram: Token Redemption Flow

 
START
  ↓
[User Opens Dashboard]
  ↓
[System Shows Token Input Screen]
  ↓
[User Enters Token]
  ↓
[Dashboard Sends Token to Backend]
  ↓
[Backend Validates Token]
  ↓
<Decision: Valid or Invalid?>
  ↓                    ↓
[Invalid]           [Valid]
  ↓                    ↓
[Show Error]      [Backend Loads Plan]
  ↓                    ↓
[Return to Input] [Dashboard Unlocks Features]
                      ↓
                  [Display Full Dashboard]
                      ↓
                    END
 

### Activity Diagram: Payment to Token Generation

 
START
  ↓
[User Selects Plan on Landing Page]
  ↓
[System Creates Stripe Checkout Session]
  ↓
[User Redirected to Stripe]
  ↓
[User Enters Payment Info]
  ↓
[Stripe Processes Payment]
  ↓
<Decision: Success or Failure?>
  ↓                    ↓
[Failure]          [Success]
  ↓                    ↓
[Show Error]      [Stripe Sends Webhook]
  ↓                    ↓
[Retry Payment]   [Backend Receives Event]
                      ↓
                  [Generate Unique Token]
                      ↓
                  [Hash Token with SHA-256]
                      ↓
                  [Store in Database]
                      ↓
                  [Send Email to User]
                      ↓
                  [Redirect to Success Page]
                      ↓
                  [Display Token to User]
                      ↓
                    END


## 6. Sequence Diagrams (Text Form)

### Sequence Diagram: Token Validation

Actor: User
UI: Dashboard Frontend
Auth: Auth Service
DB: Database

User -> UI: Enter token
UI -> Auth: POST /api/token/validate { token }
Auth -> Auth: Hash token (SHA-256)
Auth -> DB: Query token by hash
DB -> Auth: Return token data
Auth -> Auth: Check expiration & status
Auth -> UI: Return { valid, plan, features, limits }
UI -> UI: Store session in sessionStorage
UI -> User: Display dashboard with features


### Sequence Diagram: Payment and Token Generation


Actor: User
Landing: Landing Page
Stripe: Stripe Checkout
Backend: Payment Service
DB: Database
Email: Email Service

User -> Landing: Click "Get Started" on Professional plan
Landing -> Backend: POST /api/checkout/create { planId, email }
Backend -> Stripe: Create checkout session
Stripe -> Backend: Return session URL
Backend -> Landing: Return checkout URL
Landing -> User: Redirect to Stripe
User -> Stripe: Complete payment
Stripe -> Backend: Webhook: checkout.session.completed
Backend -> Backend: Generate token (LIRRA-XXXX-XXXX...)
Backend -> Backend: Hash token
Backend -> DB: Store token hash + metadata
DB -> Backend: Confirm stored
Backend -> Email: Send token to user email
Backend -> Stripe: Return 200 OK
Stripe -> User: Redirect to success page with token


## 7. Class Diagrams (Text Representation)

### Class Structure


┌─────────────────────┐
│      User           │
├─────────────────────┤
│ - userId: string    │
│ - email: string     │
│ - createdAt: Date   │
├─────────────────────┤
│                     │
└──────┬──────────────┘
       │
       │ hasMany
       │
       ↓
┌─────────────────────────────┐
│         Token               │
├─────────────────────────────┤
│ - tokenCode: string (hash)  │
│ - planType: PlanType        │
│ - expirationDate: Date      │
│ - status: TokenStatus       │
│ - createdAt: Date           │
│ - userId: string (FK)       │
│ - metadata: JSON            │
├─────────────────────────────┤
│ + validate(): boolean       │
│ + isExpired(): boolean      │
│ + revoke(): void            │
└──────┬──────────────────────┘
       │
       │ belongsTo
       │
       ↓
┌─────────────────────────┐
│        Plan             │
├─────────────────────────┤
│ - id: string            │
│ - name: string          │
│ - features: string[]    │
│ - price: PriceObj       │
│ - limits: LimitObj      │
├─────────────────────────┤
│ + getFeatures(): []     │
│ + getLimits(): {}       │
└─────────────────────────┘


┌─────────────────────────┐
│   FeatureAccess         │
├─────────────────────────┤
│ - featureName: string   │
│ - limit: number         │
│ - planId: string (FK)   │
├─────────────────────────┤
│ + checkAccess(): bool   │
└─────────────────────────┘


┌─────────────────────────────┐
│    PaymentRecord            │
├─────────────────────────────┤
│ - recordId: string          │
│ - userId: string (FK)       │
│ - amount: number            │
│ - status: PaymentStatus     │
│ - date: Date                │
│ - planType: PlanType        │
│ - stripeSessionId: string   │
├─────────────────────────────┤
│ + refund(): void            │
└─────────────────────────────┘
 

### Type Enumerations

 
enum PlanType {
  STARTER = "starter"
  PROFESSIONAL = "professional"
  ENTERPRISE = "enterprise"
}

enum TokenStatus {
  ACTIVE = "active"
  EXPIRED = "expired"
  REVOKED = "revoked"
  USED = "used"
}

enum PaymentStatus {
  PENDING = "pending"
  COMPLETED = "completed"
  FAILED = "failed"
  REFUNDED = "refunded"
}
 

### Relationships

- **User** `1 ---- * ` **Token** (one user can have many tokens)
- **Token** `* ---- 1` **Plan** (many tokens belong to one plan type)
- **Plan** `1 ---- *` **FeatureAccess** (one plan has many features)
- **User** `1  - *` **PaymentRecord** (one user has many payments)
- **PaymentRecord** `1  - 1` **Token** (one payment generates one token)

 

## 8. System Components

### Frontend Applications

**1. Landing Page** (`lirra-landingpage`)

- Public marketing site
- Pricing page with plan selection
- Stripe checkout integration
- Payment success page with token display
- No authentication required
- Static hosting (Vercel, Netlify, Cloudflare Pages)

**2. Dashboard** (`lirra-dashboard`)

- Token-gated SaaS application
- Token redemption entry point
- Feature modules (Bookkeeping, Photo Enhancer, etc.)
- Session management via sessionStorage
- Progressive Web App (PWA) capabilities

### Backend Services

**1. Authentication Service**

- Token validation endpoint
- Session management
- Rate limiting
- Security logging

**2. Payment Service**

- Stripe integration
- Checkout session creation
- Webhook handling
- Payment record storage

**3. Token Service**

- Token generation
- Token hashing (SHA-256)
- Expiration management
- Usage tracking

**4. User Service**

- User data management
- Email preferences
- Support ticket integration

**5. Feature Services**

- Auto Bookkeeping API
- Photo Enhancer API
- Label Generator API
- WhatsApp AI API
- Analytics Engine

### Infrastructure

**Database**: Supabase (PostgreSQL)

- Stores token hashes (not plain tokens)
- Payment records
- User data
- Usage analytics

**Storage**: Supabase Storage or AWS S3

- User uploaded photos
- Generated labels
- Export files (CSV, PDF)

**Email**: Resend or SendGrid

- Token delivery emails
- Receipt emails
- Support notifications

**Payments**: Stripe

- Checkout sessions
- Webhook events
- Subscription management (future)

**Hosting**:

- Frontend: Vercel or Netlify
- Backend APIs: Vercel Functions or Supabase Edge Functions
- Database: Supabase hosted PostgreSQL

 

## System Architecture Diagram (Text)

 
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────┬────────────────────────────────┬────────────────┘
             │                                │
             ↓                                ↓
    ┌────────────────┐              ┌────────────────┐
    │ Landing Page   │              │   Dashboard    │
    │   (Public)     │              │ (Token-Gated)  │
    └────────┬───────┘              └────────┬───────┘
             │                               │
             │                               │
             ↓                               ↓
    ┌─────────────────────────────────────────────────┐
    │           Backend API Layer                     │
    │  ┌──────────────────────────────────────┐      │
    │  │  /api/checkout/create                │      │
    │  │  /api/webhook/payment                │      │
    │  │  /api/token/validate                 │      │
    │  │  /api/token/generate                 │      │
    │  └──────────────────────────────────────┘      │
    └─────────────────┬───────────────────────────────┘
                      │
                      ↓
         ┌────────────────────────┐
         │   External Services    │
         │  ┌──────────────────┐  │
         │  │  Stripe          │  │
         │  │  Supabase        │  │
         │  │  Email (Resend)  │  │
         │  │  Storage (S3)    │  │
         │  └──────────────────┘  │
         └────────────────────────┘
 

 

## Data Flow

### Purchase Flow

 
User → Landing Page → Stripe Checkout → Payment Success
                           ↓
                      Webhook → Backend
                           ↓
                    Generate Token → Database
                           ↓
                      Send Email → User
 

### Access Flow

 
User → Dashboard → Enter Token → Validate API
                                      ↓
                              Check Database
                                      ↓
                              Return Plan Info
                                      ↓
                           Unlock Features → User
 

 

## Security Considerations

1. **Token Security**

   - Tokens hashed with SHA-256 before storage
   - Never log plain tokens
   - Rate limit validation attempts
   - Expire tokens after purchase period

2. **API Security**

   - HTTPS only
   - CORS configured properly
   - Rate limiting on all endpoints
   - Input validation and sanitization
   - Stripe webhook signature verification

3. **Session Management**

   - SessionStorage for temporary session
   - No sensitive data in localStorage
   - Session expires on browser close
   - Re-validation on critical actions

4. **Payment Security**
   - PCI compliance via Stripe
   - No credit card data stored
   - Webhook idempotency
   - Payment record auditing

 

## Scalability Plan

**Current Architecture**: Serverless (handles 0-10k users)

**Growth Path**:

1. **0-1k users**: Serverless functions + Supabase
2. **1k-10k users**: Add Redis cache, CDN
3. **10k-100k users**: Dedicated API servers, database read replicas
4. **100k+ users**: Microservices, load balancers, multi-region

**Cost Efficiency**:

- Serverless: Pay per use
- Database: Supabase free tier → Pro tier
- Storage: S3 lifecycle policies
- CDN: Cloudflare free tier

 

## Future Enhancements

1. **Subscription Management**

   - Auto-renewal with Stripe subscriptions
   - Grace period for expired tokens
   - Upgrade/downgrade flows

2. **Reseller Program**

   - Bulk token generation
   - Partner API for token sales
   - Commission tracking

3. **Team Features**

   - Multi-user access per token
   - Role-based permissions
   - Team collaboration tools

4. **Analytics Dashboard**
   - Token redemption rates
   - Feature usage metrics
   - Revenue analytics

 

_Last Updated: December 8, 2025_
