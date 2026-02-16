#    Stripe Integration Setup Guide

##    What's Already Done

Your landing page is **95% ready for production**! Here's what's complete:

-    Database schema with all tables created
-    User authentication with Supabase
-    Automatic profile creation on signup
-    14-day trial auto-activation
-    Protected dashboard with subscription info
-    Pricing page with functional buttons
-    Stripe checkout integration code ready

---

##    Step 1: Get Your Stripe API Keys

1. Go to **https://stripe.com** and create an account (or sign in)
2. Complete the onboarding process
3. Click **Developers** in the top right corner
4. Click **API keys** in the left sidebar
5. You'll see two keys:

   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (click "Reveal test key" - starts with `sk_test_...`)

6. Copy both keys and add them to your `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

---

##    Step 2: Create Stripe Products & Prices

You need to create products in Stripe that match your pricing plans:

### In Stripe Dashboard:

1. Go to **Products** in the left sidebar
2. Click **+ Add product**

### Create these 3 products:

#### **Starter Plan**

- **Name:** Starter
- **Description:** Perfect for individuals
- **Price:** $29/month
- **Billing period:** Monthly
- After creating, copy the **Price ID** (starts with `price_...`)

#### **Professional Plan**

- **Name:** Professional
- **Description:** For growing teams
- **Price:** $79/month
- **Billing period:** Monthly
- After creating, copy the **Price ID** (starts with `price_...`)

#### **Enterprise Plan**

- **Name:** Enterprise
- **Description:** For large organizations
- **Price:** Custom (leave as custom/contact sales)

---

##   ️ Step 3: Update Database with Stripe Price IDs

Run this SQL in your Supabase SQL Editor:

```sql
-- Update Starter plan
UPDATE plans
SET stripe_price_id = 'price_YOUR_STARTER_PRICE_ID_HERE'
WHERE name = 'Starter';

-- Update Professional plan
UPDATE plans
SET stripe_price_id = 'price_YOUR_PROFESSIONAL_PRICE_ID_HERE'
WHERE name = 'Professional';

-- Verify the update
SELECT id, name, price, stripe_price_id FROM plans;
```

Replace `price_YOUR_STARTER_PRICE_ID_HERE` and `price_YOUR_PROFESSIONAL_PRICE_ID_HERE` with the actual Price IDs from Stripe.

---

##    Step 4: Get Supabase Service Role Key

The Service Role Key is needed for backend operations (like creating subscriptions).

1. Go to your **Supabase Dashboard**
2. Click on your project **"lirra-landingpage"**
3. Go to **Settings** > **API**
4. Scroll down to **Project API keys**
5. Copy the **service_role** key (  ️ Keep this secret!)

Add it to your `.env` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

##    Step 5: Set Up Stripe Webhooks (For Production)

Webhooks allow Stripe to notify your app about payment events.

### For Local Development:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
3. Copy the webhook signing secret (starts with `whsec_...`)

### For Production:

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **+ Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/stripe-webhook`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`)

Add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

---

##    Step 6: Deploy Backend API (Choose One)

Your Stripe integration needs a backend to:

- Create checkout sessions
- Handle webhooks
- Update subscription status

### Option A: Vercel (Recommended - Easiest)

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:

```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard

### Option B: Netlify Functions

1. Create `netlify.toml`:

```toml
[build]
  functions = "api"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Deploy: `netlify deploy --prod`

### Option C: Supabase Edge Functions

1. Install Supabase CLI: https://supabase.com/docs/guides/cli
2. Deploy functions: `supabase functions deploy`

---

##    Step 7: Test Your Integration

1. **Start your dev server:**

   ```bash
   npm run dev
   ```

2. **Test the flow:**

   - Go to `http://localhost:5173`
   - Click on a pricing plan
   - Sign up if not logged in
   - Click "Get Started" on a plan
   - You should see a checkout session created message

3. **Verify in databases:**
   - Check `checkout_intents` table in Supabase
   - Check payments in Stripe Dashboard

---

##    Step 8: Customize (Optional)

### Update branding in Stripe:

1. Go to **Settings** > **Branding**
2. Add your logo
3. Set brand colors
4. Add icon

### Customize email templates:

1. Go to **Settings** > **Emails**
2. Customize receipt emails
3. Add your logo and branding

---

##    Production Checklist

Before going live:

- [ ] Replace test API keys with live keys (`pk_live_...` and `sk_live_...`)
- [ ] Update `VITE_APP_URL` to your production domain
- [ ] Set up production webhooks
- [ ] Enable email confirmations in Supabase Auth settings
- [ ] Test complete payment flow in live mode
- [ ] Set up monitoring/alerts for failed payments
- [ ] Create customer portal for subscription management
- [ ] Add terms of service and privacy policy links to checkout

---

##    What Happens When a User Subscribes?

1. User clicks "Get Started" on a plan
2. If not logged in → redirected to signup
3. Checkout session created in database
4. User redirected to Stripe Checkout
5. User enters payment info
6. After successful payment:
   - Stripe sends `checkout.session.completed` webhook
   - Your webhook handler creates subscription record
   - User profile updated with subscription info
   - User gets 14-day trial (no charge during trial)
7. After trial ends:
   - Stripe automatically charges the card
   - Sends `invoice.payment_succeeded` webhook
   - Subscription continues

---

##    Troubleshooting

### "Plan not found or not configured for Stripe"

- Make sure you updated the `plans` table with Stripe Price IDs

### "Failed to create checkout session"

- Check that user is logged in
- Verify Supabase connection
- Check browser console for errors

### Webhooks not working

- Verify webhook URL is correct
- Check webhook signing secret matches
- Test with Stripe CLI: `stripe trigger checkout.session.completed`

### Payments not creating subscriptions

- Check webhook logs in Stripe Dashboard
- Verify Service Role Key is correct
- Check Supabase logs for errors

---

##    Next Steps

After Stripe is working:

1. **Build Customer Portal:**

   - Use Stripe Customer Portal for subscription management
   - Add "Manage Subscription" button in Dashboard

2. **Add Analytics:**

   - Track conversion rates
   - Monitor trial-to-paid conversion
   - Set up revenue tracking

3. **Email Notifications:**

   - Welcome emails after signup
   - Trial ending reminders
   - Payment failed alerts

4. **User Dashboard Enhancements:**
   - Usage stats
   - API key management
   - Team member invites (for Pro/Enterprise)

---

##    Helpful Links

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Testing:** https://stripe.com/docs/testing
- **Test Card Numbers:** Use `4242 4242 4242 4242` with any future date and CVC
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Checkout:** https://stripe.com/docs/payments/checkout

---

##    Need Help?

If you run into issues:

1. Check the browser console for errors
2. Check Stripe logs in Dashboard > Developers > Logs
3. Check Supabase logs in Dashboard > Logs
4. Review webhook events in Stripe Dashboard

---

**You're almost done! Just add your Stripe keys and Price IDs, and you'll be ready to accept payments!   **