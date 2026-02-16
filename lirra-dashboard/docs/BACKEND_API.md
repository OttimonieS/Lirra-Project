# Lirra Dashboard Backend Documentation

## Overview

Complete backend API documentation for the Lirra Dashboard application. This covers all feature APIs, authentication, and admin management.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Authentication & Session Management](#authentication--session-management)
3. [Feature APIs](#feature-apis)
   - [Auto Bookkeeping](#auto-bookkeeping)
   - [Label Generator](#label-generator)
   - [Photo Enhancer](#photo-enhancer)
   - [WhatsApp AI](#whatsapp-ai)
   - [Analytics](#analytics)
   - [Store Management](#store-management)
4. [Admin APIs](#admin-apis)
5. [Database Schema](#database-schema)
6. [Access Control & Limits](#access-control--limits)

---

## Architecture

### Tech Stack

- **Runtime**: Serverless Functions (Vercel/AWS Lambda)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage / AWS S3
- **Authentication**: Token-based (no JWT, uses credential keys)
- **Language**: TypeScript

### API Structure

```
api/
├── auth/
│   ├── redeem.ts              # Token redemption
│   └── validate-session.ts    # Session validation
├── features/
│   ├── bookkeeping.ts         # Transaction management
│   ├── labels.ts              # Label generation
│   ├── photos.ts              # Photo enhancement
│   ├── whatsapp.ts            # WhatsApp AI
│   ├── analytics.ts           # Business analytics
│   └── stores.ts              # Multi-store management
└── admin/
    └── management.ts          # Admin functions
```

---

## Authentication & Session Management

### 1. Token Redemption

**Endpoint**: `POST /api/auth/redeem`

**Purpose**: Redeem a credential key and create dashboard user session

**Request**:

```json
{
  "token": "LIRRA-AB12-CD34-EF56-GH78"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "userId": "uuid-here",
  "planDetails": {
    "planType": "professional",
    "planName": "Professional",
    "expiresAt": "2025-02-08T00:00:00.000Z",
    "allowedFeatures": [
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
}
```

**Response (Error)**:

```json
{
  "success": false,
  "error": "EXPIRED_TOKEN",
  "message": "Token has expired. Please purchase a new plan."
}
```

**Flow**:

1. Hash incoming token (SHA-256)
2. Query `tokens` table by hash
3. Validate token status and expiration
4. Create or update `dashboard_users` record
5. Return plan details and allowed features

**Error Codes**:

- `MISSING_TOKEN`: No token provided
- `INVALID_TOKEN`: Token not found
- `TOKEN_NOT_ACTIVE`: Token is revoked/expired
- `EXPIRED_TOKEN`: Token past expiration date
- `USER_CREATION_FAILED`: Database error

---

### 2. Session Validation

**Endpoint**: `POST /api/auth/validate-session`

**Purpose**: Validate active session and get current plan status

**Request**:

```json
{
  "token": "LIRRA-AB12-CD34-EF56-GH78",
  "userId": "uuid-here" // optional
}
```

**Response**:

```json
{
  "valid": true,
  "planDetails": {
    "planType": "professional",
    "planName": "Professional",
    "expiresAt": "2025-02-08T00:00:00.000Z",
    "allowedFeatures": [...],
    "limits": {...}
  },
  "usage": {
    "storesUsed": 2,
    "photosProcessed": 145,
    "apiCallsUsed": 3420
  }
}
```

**When to Call**:

- On dashboard load/refresh
- Before accessing premium features
- Periodically to check expiration

---

## Feature APIs

## Auto Bookkeeping

### Insert Transaction

**Endpoint**: `POST /api/features/bookkeeping/transactions`

**Request**:

```json
{
  "userId": "uuid",
  "storeId": "uuid",
  "type": "income", // or "expense"
  "amount": 125000,
  "category": "Sales",
  "description": "Product sale",
  "date": "2025-12-08T10:30:00.000Z",
  "receiptUrl": "https://..."
}
```

**Response**:

```json
{
  "success": true,
  "transaction": {
    "transaction_id": "uuid",
    "type": "income",
    "amount": 125000,
    "category": "Sales",
    "transaction_date": "2025-12-08T10:30:00.000Z",
    "created_at": "2025-12-08T10:30:15.000Z"
  }
}
```

---

### List Transactions

**Endpoint**: `GET /api/features/bookkeeping/transactions`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `type` (optional): "income" | "expense"
- `startDate` (optional)
- `endDate` (optional)

**Response**:

```json
{
  "success": true,
  "transactions": [...],
  "count": 45
}
```

---

### Scan Receipt (OCR)

**Endpoint**: `POST /api/features/bookkeeping/scan-receipt`

**Request**:

```json
{
  "imageUrl": "https://storage.../receipt.jpg",
  "userId": "uuid"
}
```

**Response**:

```json
{
  "success": true,
  "extractedData": {
    "merchantName": "Toko Sumber Rejeki",
    "date": "2025-12-08T00:00:00.000Z",
    "total": 125000,
    "items": [
      { "name": "Beras 5kg", "quantity": 2, "price": 50000 },
      { "name": "Minyak Goreng 2L", "quantity": 1, "price": 25000 }
    ],
    "category": "Groceries",
    "rawText": "..."
  }
}
```

**Integration Note**: Use Google Vision API, AWS Textract, or Azure Computer Vision for production OCR.

---

### Generate Reports

**Endpoint**: `GET /api/features/bookkeeping/reports`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `period`: "daily" | "weekly" | "monthly" | "yearly"

**Response**:

```json
{
  "success": true,
  "report": {
    "period": "monthly",
    "startDate": "2025-11-08T00:00:00.000Z",
    "endDate": "2025-12-08T00:00:00.000Z",
    "totalIncome": 5400000,
    "totalExpenses": 2100000,
    "cashFlow": 3300000,
    "transactionCount": 87,
    "byCategory": {
      "Sales": { "income": 5400000, "expenses": 0 },
      "Inventory": { "income": 0, "expenses": 1500000 },
      "Operational": { "income": 0, "expenses": 600000 }
    }
  }
}
```

---

### Calculate Cash Flow

**Endpoint**: `GET /api/features/bookkeeping/cashflow`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `months`: Number of months back (default: 6)

**Response**:

```json
{
  "success": true,
  "cashFlow": [
    {
      "month": "2025-06",
      "income": 4200000,
      "expenses": 1800000,
      "net": 2400000
    },
    {
      "month": "2025-07",
      "income": 5100000,
      "expenses": 2100000,
      "net": 3000000
    }
    // ... more months
  ]
}
```

---

## Label Generator

### Generate Label

**Endpoint**: `POST /api/features/labels/generate`

**Request**:

```json
{
  "userId": "uuid",
  "storeId": "uuid",
  "templateId": "uuid",
  "labelData": {
    "productName": "Keripik Singkong",
    "price": "Rp 15.000",
    "barcode": "8991234567890"
  },
  "format": "pdf" // or "png"
}
```

**Response**:

```json
{
  "success": true,
  "label": {
    "labelId": "uuid",
    "format": "pdf",
    "downloadUrl": "https://storage.../labels/uuid.pdf",
    "previewUrl": "https://storage.../labels/uuid_preview.png",
    "createdAt": "2025-12-08T10:30:00.000Z"
  }
}
```

---

### Get Templates

**Endpoint**: `GET /api/features/labels/templates`

**Response**:

```json
{
  "success": true,
  "templates": [
    {
      "template_id": "uuid",
      "name": "Basic Product Label",
      "description": "Simple product label with name and price",
      "template_data": {
        "width": 100,
        "height": 50,
        "fields": ["productName", "price", "barcode"]
      },
      "preview_url": "https://..."
    }
  ]
}
```

---

### Save Preset

**Endpoint**: `POST /api/features/labels/presets`

**Request**:

```json
{
  "userId": "uuid",
  "presetName": "My Standard Label",
  "templateId": "uuid",
  "labelData": {...}
}
```

**Response**:

```json
{
  "success": true,
  "preset": {
    "preset_id": "uuid",
    "preset_name": "My Standard Label",
    "created_at": "2025-12-08T10:30:00.000Z"
  }
}
```

---

## Photo Enhancer

### Enhance Photo

**Endpoint**: `POST /api/features/photos/enhance`

**Request**:

```json
{
  "userId": "uuid",
  "imageUrl": "https://storage.../original.jpg",
  "enhancements": ["remove-background", "enhance-lighting", "upscale"],
  "storeId": "uuid"
}
```

**Response** (Async - job created):

```json
{
  "success": true,
  "jobId": "uuid",
  "status": "processing",
  "message": "Photo enhancement started"
}
```

**Poll Status**: `GET /api/features/photos/status?jobId=uuid`

**Status Response**:

```json
{
  "success": true,
  "job": {
    "jobId": "uuid",
    "status": "completed", // or "processing", "failed"
    "originalUrl": "https://...",
    "enhancedUrl": "https://...",
    "enhancements": ["remove-background", "enhance-lighting"],
    "createdAt": "2025-12-08T10:30:00.000Z",
    "completedAt": "2025-12-08T10:30:45.000Z"
  }
}
```

---

### Batch Process

**Endpoint**: `POST /api/features/photos/batch`

**Request**:

```json
{
  "userId": "uuid",
  "images": [
    { "url": "https://...", "name": "product1.jpg" },
    { "url": "https://...", "name": "product2.jpg" }
  ],
  "enhancements": ["enhance-lighting"],
  "storeId": "uuid"
}
```

**Response**:

```json
{
  "success": true,
  "batchId": "uuid",
  "jobIds": ["uuid1", "uuid2"],
  "totalImages": 2,
  "status": "processing"
}
```

**Plan Limits**:

- Starter: No batch processing (single files only)
- Professional: Batch up to 50 images
- Enterprise: Unlimited batch processing

---

## WhatsApp AI

### Connect WhatsApp

**Endpoint**: `POST /api/features/whatsapp/connect`

**Request**:

```json
{
  "userId": "uuid",
  "phoneNumber": "+628123456789",
  "apiKey": "whatsapp-api-key",
  "storeId": "uuid"
}
```

**Response**:

```json
{
  "success": true,
  "connection": {
    "connection_id": "uuid",
    "phone_number": "+628123456789",
    "status": "active",
    "connected_at": "2025-12-08T10:30:00.000Z"
  },
  "message": "WhatsApp connected successfully"
}
```

---

### Update Product Catalog

**Endpoint**: `POST /api/features/whatsapp/catalog`

**Request**:

```json
{
  "userId": "uuid",
  "storeId": "uuid",
  "products": [
    {
      "name": "Keripik Singkong",
      "price": 15000,
      "description": "Keripik singkong rasa original",
      "imageUrl": "https://...",
      "stock": 100,
      "sku": "KS-001"
    }
  ]
}
```

**Response**:

```json
{
  "success": true,
  "products": [...],
  "count": 1
}
```

---

### Generate AI Reply

**Endpoint**: `POST /api/features/whatsapp/generate-reply`

**Request**:

```json
{
  "userId": "uuid",
  "storeId": "uuid",
  "customerMessage": "Halo, harga keripik singkong berapa?",
  "context": {
    "previousMessages": [],
    "customerName": "Budi"
  }
}
```

**Response**:

```json
{
  "success": true,
  "reply": "Halo! Untuk Keripik Singkong, harganya Rp 15.000. Stok masih tersedia. Mau pesan berapa?"
}
```

**AI Integration**: Use OpenAI GPT-4, Anthropic Claude, or local LLM with Indonesian language support.

---

### Get Chat Logs

**Endpoint**: `GET /api/features/whatsapp/logs`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `limit` (default: 50)
- `startDate` (optional)
- `endDate` (optional)

**Response**:

```json
{
  "success": true,
  "logs": [
    {
      "log_id": "uuid",
      "customer_phone": "+628123456789",
      "customer_message": "...",
      "ai_reply": "...",
      "created_at": "2025-12-08T10:30:00.000Z"
    }
  ],
  "count": 50
}
```

---

## Analytics

### Get Sales Data

**Endpoint**: `GET /api/features/analytics/sales`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `period`: "today" | "week" | "month" | "year" | "custom"
- `startDate` (for custom)
- `endDate` (for custom)

**Response**:

```json
{
  "success": true,
  "period": "month",
  "startDate": "2025-11-08T00:00:00.000Z",
  "endDate": "2025-12-08T00:00:00.000Z",
  "metrics": {
    "totalSales": 5400000,
    "transactionCount": 87,
    "averageTransaction": 62069
  },
  "chartData": [
    { "date": "2025-11-08", "amount": 180000 },
    { "date": "2025-11-09", "amount": 205000 }
    // ...
  ]
}
```

---

### Get Top Products

**Endpoint**: `GET /api/features/analytics/top-products`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `limit` (default: 10)
- `period`: "month" | "year"

**Response**:

```json
{
  "success": true,
  "topProducts": [
    {
      "productName": "Keripik Singkong",
      "quantitySold": 340,
      "revenue": 5100000
    },
    {
      "productName": "Kerupuk Udang",
      "quantitySold": 280,
      "revenue": 4200000
    }
  ]
}
```

---

### Get Busiest Hours

**Endpoint**: `GET /api/features/analytics/busiest-hours`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)

**Response**:

```json
{
  "success": true,
  "hourlyData": [
    { "hour": 0, "hourLabel": "00:00", "transactions": 2 },
    { "hour": 1, "hourLabel": "01:00", "transactions": 0 },
    // ...
    { "hour": 14, "hourLabel": "14:00", "transactions": 45 }
  ],
  "peakHours": [
    { "hour": 14, "hourLabel": "14:00", "transactions": 45 },
    { "hour": 17, "hourLabel": "17:00", "transactions": 38 },
    { "hour": 10, "hourLabel": "10:00", "transactions": 32 }
  ]
}
```

---

### Get Operational Costs

**Endpoint**: `GET /api/features/analytics/operational-costs`

**Query Parameters**:

- `userId` (required)
- `storeId` (optional)
- `period`: "month" | "year"

**Response**:

```json
{
  "success": true,
  "totalCosts": 2100000,
  "categoryBreakdown": [
    {
      "category": "Inventory",
      "amount": 1500000,
      "percentage": 71.43
    },
    {
      "category": "Operational",
      "amount": 600000,
      "percentage": 28.57
    }
  ],
  "monthlyTrend": [
    { "month": "2025-11", "amount": 1800000 },
    { "month": "2025-12", "amount": 2100000 }
  ]
}
```

---

## Store Management

### Create Store

**Endpoint**: `POST /api/features/stores/create`

**Request**:

```json
{
  "userId": "uuid",
  "storeName": "Toko Makmur Cabang 2",
  "address": "Jl. Merdeka No. 45",
  "phoneNumber": "+628123456789",
  "storeType": "both",
  "description": "Cabang kedua di Surabaya"
}
```

**Response**:

```json
{
  "success": true,
  "store": {
    "store_id": "uuid",
    "store_name": "Toko Makmur Cabang 2",
    "address": "...",
    "is_active": true,
    "created_at": "2025-12-08T10:30:00.000Z"
  }
}
```

**Plan Limits**:

- Starter: 1 store
- Professional: 3 stores
- Enterprise: Unlimited

**Error if limit reached**:

```json
{
  "error": "Store limit reached",
  "message": "Your professional plan allows up to 3 store(s)",
  "upgradeRequired": true
}
```

---

### List Stores

**Endpoint**: `GET /api/features/stores?userId=uuid`

**Response**:

```json
{
  "success": true,
  "stores": [...],
  "count": 2
}
```

---

### Assign User Role (Enterprise Only)

**Endpoint**: `POST /api/features/stores/roles`

**Request**:

```json
{
  "storeId": "uuid",
  "userId": "uuid",
  "targetUserEmail": "staff@example.com",
  "role": "staff" // owner | admin | staff | viewer
}
```

**Response**:

```json
{
  "success": true,
  "roleAssignment": {
    "role_id": "uuid",
    "user_email": "staff@example.com",
    "role": "staff",
    "assigned_at": "2025-12-08T10:30:00.000Z"
  }
}
```

**Plan Required**: Enterprise

---

## Admin APIs

All admin endpoints require `X-API-Key` header with admin secret.

### Deactivate Token

**Endpoint**: `POST /api/admin/tokens/deactivate`

**Headers**: `X-API-Key: admin_secret_key`

**Request**:

```json
{
  "token": "LIRRA-AB12-CD34-EF56-GH78",
  "reason": "User requested refund"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Token deactivated successfully",
  "token": {
    "planType": "professional",
    "userEmail": "customer@example.com",
    "status": "revoked"
  }
}
```

---

### View All Users

**Endpoint**: `GET /api/admin/users`

**Headers**: `X-API-Key: admin_secret_key`

**Query Parameters**:

- `page` (default: 1)
- `limit` (default: 50)
- `planType`: "starter" | "professional" | "enterprise"
- `status`: "active" | "expired" | "revoked"
- `search`: Search by email

**Response**:

```json
{
  "success": true,
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 245,
    "totalPages": 5
  }
}
```

---

### Get System Statistics

**Endpoint**: `GET /api/admin/stats`

**Headers**: `X-API-Key: admin_secret_key`

**Response**:

```json
{
  "success": true,
  "stats": {
    "totalUsers": 245,
    "usersByPlan": {
      "starter": 120,
      "professional": 105,
      "enterprise": 20
    },
    "tokens": {
      "active": 230,
      "expired": 10,
      "revoked": 5
    },
    "revenue": {
      "total": 49000,
      "paymentsCount": 245
    },
    "featureUsage": {
      "photosProcessed": 12450,
      "labelsGenerated": 3420,
      "aiRepliesGenerated": 8930
    }
  }
}
```

---

### Extend Token Expiration

**Endpoint**: `POST /api/admin/tokens/extend`

**Headers**: `X-API-Key: admin_secret_key`

**Request**:

```json
{
  "token": "LIRRA-AB12-CD34-EF56-GH78",
  "daysToAdd": 30,
  "reason": "Compensation for service downtime"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Token expiration extended successfully",
  "newExpiry": "2025-02-07T00:00:00.000Z"
}
```

---

## Access Control & Limits

### Plan Comparison

| Feature            | Starter     | Professional | Enterprise      |
| ------------------ | ----------- | ------------ | --------------- |
| Stores             | 1           | 3            | Unlimited       |
| Photo Processing   | Single file | Batch (50)   | Unlimited batch |
| API Calls/month    | 1,000       | 10,000       | Unlimited       |
| Users              | 1           | 3            | Unlimited       |
| Team Roles         | ❌          | ❌           | ✅              |
| Custom AI Training | ❌          | ❌           | ✅              |
| API Access         | ❌          | ❌           | ✅              |

### Enforcement

API endpoints check plan limits before processing:

```typescript
// Example: Check store limit
const { data: userData } = await supabase
  .from("dashboard_users")
  .select("plan_type")
  .eq("user_id", userId)
  .single();

const limits = { starter: 1, professional: 3, enterprise: Infinity };
const limit = limits[userData.plan_type];

if (storeCount >= limit) {
  return res.status(403).json({
    error: "Store limit reached",
    upgradeRequired: true,
  });
}
```

---

## Error Handling

All APIs follow consistent error format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `202`: Accepted (async processing)
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden (plan limit)
- `404`: Not found
- `405`: Method not allowed
- `500`: Server error

---

## Rate Limiting

- **General APIs**: 60 requests/minute per user
- **Photo Enhancement**: 10 requests/minute per user
- **AI Reply Generation**: 20 requests/minute per user
- **Admin APIs**: 1000 requests/minute

Implement using Upstash Redis or Vercel Edge Config.

---

## Deployment

### Environment Variables

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx

# Admin
ADMIN_API_KEY=xxx

# URLs
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.lirra.app

# External Services (optional)
REMOVEBG_API_KEY=xxx
OPENAI_API_KEY=xxx
RESEND_API_KEY=xxx
```

### Vercel Deployment

```bash
cd Lirra-dashboard
vercel --prod
```

---

_Last Updated: December 8, 2025_