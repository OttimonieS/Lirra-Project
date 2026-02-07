#    Lirra Landing Page

A modern, production-ready SaaS landing page with authentication, subscriptions, and Stripe payment integration.

##    Features

-    **Modern UI** - Built with React 19 + Tailwind CSS v4
-    **Authentication** - Secure user auth with Supabase
-    **Payments** - Stripe integration for subscriptions
-    **Dashboard** - User dashboard with subscription management
-    **Fast** - Powered by Vite 7.2 with Rolldown
-    **Secure** - Row Level Security (RLS) policies
-    **Responsive** - Mobile-first design
-    **14-Day Trial** - Automatic trial activation

##    Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env` and add your credentials:

```env
# Supabase (already configured)
VITE_SUPABASE_URL=https://wexrwhrddhgeejhqlaya.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_HpVrMe9mOMLJWypt-uX-oQ_K_l3CHGE

# Stripe (add your keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# App URL
VITE_APP_URL=http://localhost:5173
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

##    Complete Setup Guide

For detailed Stripe integration setup, see **[STRIPE_SETUP.md](./STRIPE_SETUP.md)**

##   ️ Project Structure

```
├── api/                          # Backend API functions
│   ├── create-checkout-session.ts # Stripe checkout handler
│   └── stripe-webhook.ts         # Stripe webhook handler
├── src/
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   └── sections/             # Landing page sections
│   ├── data/                     # Separated data files
│   ├── lib/                      # Supabase & Stripe clients
│   ├── pages/                    # All page components
│   │   ├── Home.tsx              # Landing page
│   │   ├── SignIn.tsx            # Login page
│   │   ├── SignUp.tsx            # Registration
│   │   ├── Dashboard.tsx         # User dashboard
│   │   └── ...                   # Support pages
│   ├── utils/                    # Helper functions
│   └── types/                    # TypeScript types
├── supabase-schema.sql           # Database schema
└── STRIPE_SETUP.md               # Setup instructions
```

##    Landing Page Sections

1. **Hero** - Main value proposition with CTA
2. **Why Choose Us** - Key benefits (smooth scroll from Hero)
3. **Solution** - Platform overview
4. **Features** - Vision-based accessibility features
5. **Pricing** - Three-tier pricing (Starter, Professional, Enterprise)
6. **Resources** - Links to docs, blog, community, support
7. **Testimonials** - Social proof
8. **Call to Action** - Final conversion push

##    Authentication Flow

1. User signs up → Email verification sent
2. Profile automatically created in database
3. 14-day trial auto-activated
4. User redirected to dashboard
5. Can subscribe to paid plan anytime

##    Payment Flow

1. User clicks "Get Started" on pricing plan
2. Checkout session created in database
3. Redirected to Stripe Checkout (when integrated)
4. After payment → Webhook creates subscription
5. User dashboard shows subscription status

##   ️ Database Schema

Already created in Supabase with these tables:

- **profiles** - User profiles (auto-created on signup)
- **plans** - Pricing tiers (Starter, Professional, Enterprise)
- **subscriptions** - Active user subscriptions
- **leads** - Newsletter signups
- **checkout_intents** - Payment session tracking

##   ️ Tech Stack

- **Frontend:** React 19.2.0, TypeScript 5.9.3
- **Styling:** Tailwind CSS v4.1.17
- **Build:** Vite 7.2.5 (Rolldown)
- **Routing:** React Router
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe
- **Icons:** Lucide React

##    Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

##    Pages

- `/` - Landing page
- `/signin` - Sign in
- `/signup` - Sign up
- `/dashboard` - User dashboard (protected)
- `/documentation` - Docs
- `/blog` - Blog
- `/community` - Community
- `/support` - Support
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/cookies` - Cookie Policy

##   ️ Next Steps

1. **Get Stripe Keys** - Follow [STRIPE_SETUP.md](./STRIPE_SETUP.md)
2. **Create Stripe Products** - Set up pricing in Stripe Dashboard
3. **Update Database** - Add Stripe Price IDs to plans table
4. **Deploy Backend** - Deploy API functions (Vercel/Netlify/Supabase)
5. **Set Up Webhooks** - Configure Stripe webhooks
6. **Test Payment Flow** - Use test cards to verify
7. **Go Live** - Switch to live Stripe keys

##    Customization

### Colors

Edit `src/index.css` to change theme colors:

```css
@theme {
  --color-primary: #3b82f6; /* Blue */
  --color-secondary: #8b5cf6; /* Purple */
  --color-dark-gray: #6b7280;
  --color-light-gray: #f3f4f6;
  --color-gray: #d1d5db;
}
```

### Branding

- Update company name in components
- Replace logo in Navbar
- Customize meta tags in `index.html`

##    Security Features

-    Row Level Security (RLS) on all tables
-    JWT authentication with Supabase
-    Password hashing (bcrypt)
-    Email verification required
-    Protected routes
-    Secure API calls with service role key
-    HTTPS enforced in production

##    Monitoring

After deployment, monitor:

- Stripe Dashboard → Payments, Subscriptions
- Supabase Dashboard → Database, Auth logs
- Analytics → Conversion rates, trial-to-paid

##    Troubleshooting

**Blank page?**

- Check browser console for errors
- Verify .env variables are set
- Ensure Supabase project is active

**Auth not working?**

- Check Supabase credentials
- Verify email confirmation settings
- Check RLS policies

**Payments failing?**

- Verify Stripe keys are correct
- Check webhook configuration
- Review Stripe logs

##    License

MIT

##    Contributing

This is a production-ready template. Feel free to customize for your needs!

---

**Built with   ️ using React, Tailwind CSS, Supabase, and Stripe**
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
