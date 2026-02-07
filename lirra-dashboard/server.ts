/**
 * Local Development Server for API Routes
 * Run: npm run api
 */

import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

interface RedeemRequest {
  credential_key: string;
  email: string;
  user_id?: string;
}

interface LinkProfileRequest {
  credential_key_id: string;
  plan_id: string;
  subscription_expires_at: string;
  billing_cycle: string;
  email: string;
  auth_user_id: string;
}

// Redeem API
app.post(
  "/api/auth/redeem",
  async (req: Request<object, object, RedeemRequest>, res: Response) => {
    console.log("🔑 Redeem request:", req.body);

    const { credential_key, email, user_id } = req.body;

    if (!credential_key || !email) {
      return res.status(400).json({
        success: false,
        error: "credential_key and email are required",
      });
    }

    try {
      // Step 1: Validate credential key
      console.log("🔍 Looking for key:", credential_key);

      const { data: keyData, error: keyError } = await supabase
        .from("credential_keys")
        .select(
          `
        *,
        plans (
          name,
          features
        )
      `
        )
        .eq("credential_key", credential_key)
        .single();

      console.log("Database response:", { keyData, keyError });

      if (keyError || !keyData) {
        console.log("❌ Key not found. Error:", keyError?.message);
        return res.status(404).json({
          success: false,
          error: "Invalid credential key",
          details: keyError?.message || "Key not found in database",
        });
      }

      // Step 2: Check if already redeemed
      if (keyData.is_redeemed) {
        return res.status(400).json({
          success: false,
          error: "This credential key has already been redeemed",
        });
      }

      // Step 3: Verify email matches
      if (keyData.email.toLowerCase() !== email.toLowerCase()) {
        return res.status(403).json({
          success: false,
          error: "Email does not match the credential key",
        });
      }

      // Step 4: Check expiration
      const expiresAt = new Date(keyData.expires_at);
      if (expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: "Credential key has expired",
        });
      }

      // Step 5: Check if user already has a profile
      let hasPassword = false;
      if (user_id) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("password_set")
          .eq("id", user_id)
          .single();

        hasPassword = existingProfile?.password_set || false;
      }

      // Step 6: Store credential key data in temporary storage for setup-password page
      // We DON'T mark as redeemed yet - that happens in link-profile after password is set
      console.log("Key validated successfully");

      return res.status(200).json({
        success: true,
        message: "Credential key validated successfully!",
        keyData: {
          credential_key_id: keyData.id,
          plan_id: keyData.plan_id,
          expires_at: keyData.expires_at,
          billing_cycle: keyData.billing_cycle,
        },
        hasPassword,
        planDetails: {
          planName: keyData.plans?.name || "Unknown",
          billingCycle: keyData.billing_cycle || "monthly",
          expiresAt: keyData.expires_at,
          features: keyData.plans?.features || [],
        },
      });
    } catch (error) {
      console.error("Redeem error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Link Profile API - Creates profile after user sets password
app.post(
  "/api/auth/link-profile",
  async (req: Request<object, object, LinkProfileRequest>, res: Response) => {
    console.log("Link profile request:", req.body);

    const {
      credential_key_id,
      plan_id,
      subscription_expires_at,
      email,
      auth_user_id,
    } = req.body;

    if (!credential_key_id || !auth_user_id || !plan_id) {
      return res.status(400).json({
        success: false,
        error: "credential_key_id, plan_id, and auth_user_id are required",
      });
    }

    try {
      // Step 1: Create the profile with the auth user's ID
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: auth_user_id, // Use auth user ID as profile ID
          email: email,
          plan_id: plan_id,
          credential_key_id: credential_key_id,
          subscription_status: "active",
          subscription_expires_at: subscription_expires_at,
          password_set: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return res.status(500).json({
          success: false,
          error: "Failed to create profile",
          details: profileError.message,
        });
      }

      // Step 2: Mark credential key as redeemed
      const { error: updateError } = await supabase
        .from("credential_keys")
        .update({
          is_redeemed: true,
          redeemed_at: new Date().toISOString(),
          redeemed_by_user_id: auth_user_id,
        })
        .eq("id", credential_key_id);

      if (updateError) {
        console.error("Error updating credential key:", updateError);
        // Don't fail if this step fails - profile is already created
      }

      console.log("✅ Profile created and linked successfully");

      return res.status(200).json({
        success: true,
        profile: profile,
      });
    } catch (error) {
      console.error("Link profile error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Debug endpoint - check credential keys
app.get("/api/debug/keys", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("credential_keys")
      .select("credential_key, email, is_redeemed, expires_at")
      .limit(10);

    if (error) {
      return res.json({ error: error.message });
    }

    return res.json({
      count: data.length,
      keys: data,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 API Server: http://localhost:${PORT}`);
  console.log(`📡 CORS: http://localhost:5174`);
  console.log(`✅ Ready to handle requests\n`);
});
