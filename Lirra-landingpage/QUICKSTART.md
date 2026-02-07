# QUICK START

## Get Stripe Keys (5 min)

1. **Sign up for Stripe:** https://stripe.com
2. **Get your keys:**

   - Dashboard → Developers → API keys
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (click "Reveal" - starts with `sk_test_`)

3. **Add to .env file:**

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

Save the secret key for later (you'll need it when deploying the backend).

  

## Step 2: Create Stripe Products (8 min)

1. **Go to:** Stripe Dashboard → Products → + Add product

2. **Create Starter Plan:**

   - Name: `Starter`
   - Description: `Perfect for individuals`
   - Pricing: `$29` / `month`
   - Click **Save product**
   - **Copy the Price ID** (looks like `price_1Abc2DefGhi3Jkl`)

3. **Create Professional Plan:**

   - Name: `Professional`
   - Description: `For growing teams`
   - Pricing: `$79` / `month`
   - Click **Save product**
   - **Copy the Price ID**

4. **Create Enterprise Plan:**
   - Name: `Enterprise`
   - Set to **Contact for pricing** or custom

  

## Step 3: Update Your Database (2 min)

1. **Go to:** Supabase Dashboard → SQL Editor
2. **Run this SQL** (replace with your actual Price IDs):

```sql
-- Update Starter plan with your Stripe Price ID
UPDATE plans
SET stripe_price_id = 'price_YOUR_STARTER_PRICE_ID_HERE'
WHERE name = 'Starter';

-- Update Professional plan with your Stripe Price ID
UPDATE plans
SET stripe_price_id = 'price_YOUR_PROFESSIONAL_PRICE_ID_HERE'
WHERE name = 'Professional';

-- Verify it worked
SELECT name, price, stripe_price_id FROM plans;
```

You should see your Price IDs in the results!

  

## Test It Out

### Test the Flow:

1. **Open the app:** http://localhost:5174

2. **Create account:**

   - Click "Get Started" on any plan
   - Sign up with your email
   - Check email for verification link

3. **Sign in:**

   - Verify your email
   - Sign in at http://localhost:5174/signin

4. **Subscribe to a plan:**
   - Go to pricing section
   - Click "Get Started"
   - You'll see "Checkout session created!" message

**Note:** For full Stripe Checkout, you'll need to deploy the backend API (see next section).

  

## Deploy Backend (Optional - For Full Stripe)

To get the complete Stripe Checkout working, deploy the backend:

### Option 1: Vercel (Easiest)

```bash
npm i -g vercel
vercel
```

Add these environment variables in Vercel dashboard:

- `STRIPE_SECRET_KEY` = sk*test*...
- `SUPABASE_SERVICE_ROLE_KEY` = (get from Supabase → Settings → API)
- `VITE_SUPABASE_URL` = yout_supabase_url
- `VITE_SUPABASE_ANON_KEY` = your_anon_key



### Option 2: Use Supabase Edge Functions

See full guide in [STRIPE_SETUP.md](./STRIPE_SETUP.md)

  

## Test Card Numbers

Use these in Stripe test mode:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires auth:** `4000 0025 0000 3155`
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

  

## What Works Right Now

 **Without Backend Deployment:**

- Beautiful landing page
- User authentication (signup/signin)
- Email verification
- User dashboard
- Checkout intent creation
- Database tracking

 **After Backend Deployment:**
 
- Full Stripe Checkout redirect
- Payment processing
- Subscription creation
- Webhook handling
- 14-day trial activation
- Automatic billing after trial

## Need More Help?

- **Detailed guide:** [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- **Project status:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Stripe docs:** https://stripe.com/docs
- **Test mode:** https://stripe.com/docs/testing