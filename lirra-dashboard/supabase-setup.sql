-- ============================================
-- LIRRA DASHBOARD - SUPABASE SETUP SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard connects to landing page database

-- ============================================
-- 1. UPDATE PROFILES TABLE
-- ============================================
-- Add auth_user_id to link Supabase Auth users with profiles
-- Add password_set flag to track if user has created password

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS username VARCHAR(100);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = auth_user_id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = auth_user_id);

-- Policy: Service role can insert profiles (for key redemption)
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (true);

-- ============================================
-- 3. CREDENTIAL_KEYS TABLE RLS
-- ============================================
-- Enable RLS on credential_keys table
ALTER TABLE credential_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own credential keys
DROP POLICY IF EXISTS "Users can read own keys" ON credential_keys;
CREATE POLICY "Users can read own keys" 
ON credential_keys FOR SELECT 
USING (
  email = (SELECT email FROM profiles WHERE auth_user_id = auth.uid())
  OR redeemed_by_user_id::uuid = auth.uid()
);

-- Policy: Service role can update keys (for redemption)
DROP POLICY IF EXISTS "Service role can update keys" ON credential_keys;
CREATE POLICY "Service role can update keys" 
ON credential_keys FOR UPDATE 
WITH CHECK (true);

-- ============================================
-- 4. PLANS TABLE RLS
-- ============================================
-- Enable RLS on plans table (read-only for all)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read plans
DROP POLICY IF EXISTS "Anyone can read plans" ON plans;
CREATE POLICY "Anyone can read plans" 
ON plans FOR SELECT 
TO authenticated, anon
USING (true);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function: Get user profile with plan details
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  username VARCHAR,
  plan_name VARCHAR,
  billing_cycle VARCHAR,
  subscription_status VARCHAR,
  subscription_expires_at TIMESTAMPTZ,
  credential_key VARCHAR,
  password_set BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.username,
    pl.name as plan_name,
    pl.billing_cycle,
    p.subscription_status,
    p.subscription_expires_at,
    ck.credential_key,
    p.password_set,
    p.created_at
  FROM profiles p
  LEFT JOIN plans pl ON p.plan_id = pl.id
  LEFT JOIN credential_keys ck ON p.credential_key_id = ck.id
  WHERE p.auth_user_id = user_id;
END;
$$;

-- ============================================
-- 6. TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGNUP
-- ============================================
-- This creates a profile entry when user sets password

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create profile if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = NEW.email) THEN
    INSERT INTO profiles (auth_user_id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW());
  ELSE
    -- Link existing profile to auth user
    UPDATE profiles
    SET auth_user_id = NEW.id, password_set = TRUE, updated_at = NOW()
    WHERE email = NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 7. VERIFICATION QUERIES
-- ============================================
-- Run these to verify setup

-- Check if columns exist
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
-- AND column_name IN ('auth_user_id', 'password_set', 'username');

-- Check policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('profiles', 'credential_keys', 'plans');

-- Check trigger
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Copy/paste this entire script into Supabase SQL Editor
-- 2. Run the script
-- 3. Verify no errors in the output
-- 4. Update your .env file with the Service Role Key
