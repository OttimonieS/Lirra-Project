https://supabase.com/dashboard/project/wexrwhrddhgeejhqlaya

# Lirra - SaaS Platform

Complete SaaS platform with landing page and user dashboard for subscription management.

## Project Structure

```
lirra/
├── lirra-landingpage/    # Marketing site with payment integration
└── lirra-dashboard/      # User dashboard for subscription management
```

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Supabase account (for database and authentication)
- Stripe account (for payments on landing page)

## Environment Setup

### Landing Page (.env)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Dashboard (.env)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Installation

### 1. Install Dependencies

**Landing Page:**

```bash
cd lirra-landingpage
npm install
```

**Dashboard:**

```bash
cd lirra-dashboard
npm install
```

### 2. Database Setup

Run these SQL scripts in Supabase SQL Editor (in order):

1. `supabase-setup.sql` - Creates tables and RLS policies
2. `fix-profiles-id.sql` - Configures UUID auto-generation
3. `check-and-fix-auth-trigger.sql` - Removes conflicting triggers

## Running the Applications

### Landing Page (Port 5173 & 3001)

Open **two terminals** in the `lirra-landingpage` directory:

**Terminal 1 - Frontend:**

```bash
npm run dev
```

This starts the Vite dev server on http://localhost:5173

**Terminal 2 - API Server:**

```bash
npm run api
```

This starts the Express API server on http://localhost:3001

## Quick Start Commands

**  Start Everything with One Command:**

```powershell
.\start-all.ps1
```

This automatically starts all 4 services in separate terminal windows:

- Landing Page Frontend (Port 5173)
- Landing Page API (Port 3001)
- Dashboard Frontend (Port 5174)
- Dashboard API (Port 3000)
**Or start manually (PowerShell):**

## User Flow

1. **Purchase** → User visits landing page (localhost:5173) and purchases a plan
2. **Receive Key** → System generates credential key and sends to email
3. **Redeem** → User visits dashboard (localhost:5174/redeem-key) and enters key
4. **Setup Password** → User creates password for dashboard access
5. **Dashboard** → User accesses full dashboard with subscription details

## Features

### Landing Page

- Pricing plans display
- Stripe payment integration
- Credential key generation
- Email notifications

### Dashboard

- Secure authentication (Supabase Auth)
- Subscription status display
- Protected credential key (password verification required)
- Plan details and expiration tracking
- User profile management

## Troubleshooting

**API returns 404:**

- Ensure both `npm run dev` AND `npm run api` are running
- Check that ports 3000/3001 are not blocked

**Database errors:**

- Verify all SQL scripts have been run in Supabase
- Check that environment variables are correct
- Ensure Supabase service role key format is correct

**Auth errors:**

- Run `check-and-fix-auth-trigger.sql` to remove conflicting triggers
- Check that email confirmation is disabled in Supabase Auth settings

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Icons:** Lucide React