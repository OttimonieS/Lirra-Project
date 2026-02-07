/**
 * Token Redemption API
 * POST /api/auth/redeem
 *
 * Redeems a credential key from landing page and creates dashboard profile
 * Connects to landing page database tables: credential_keys, profiles, plans
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RedeemRequest {
  credential_key: string;
  email: string;
  user_id?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  const { credential_key, email, user_id }: RedeemRequest = req.body;

  if (!credential_key || !email) {
    return res.status(400).json({
      success: false,
      error: "credential_key and email are required",
    });
  }

  try {
    // Step 1: Validate credential key from landing page database
    const { data: keyData, error: keyError } = await supabase
      .from("credential_keys")
      .select(
        `
        *,
        plans (
          name,
          billing_cycle,
          features
        )
      `
      )
      .eq("credential_key", credential_key)
      .single();

    if (keyError || !keyData) {
      return res.status(404).json({
        success: false,
        error: "Invalid credential key",
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

    // Step 5: Mark key as redeemed
    const { error: updateError } = await supabase
      .from("credential_keys")
      .update({
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
        redeemed_by_user_id: user_id || null,
      })
      .eq("id", keyData.id);

    if (updateError) {
      console.error("Error updating credential key:", updateError);
      return res.status(500).json({
        success: false,
        error: "Failed to redeem credential key",
      });
    }

    // Step 6: Create or update profile
    const profileData = {
      email: email,
      plan_id: keyData.plan_id,
      credential_key_id: keyData.id,
      subscription_status: "active",
      subscription_expires_at: keyData.expires_at,
    };

    let profileId = user_id;
    let hasPassword = false;

    if (user_id) {
      // Update existing profile
      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user_id,
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select("password_set")
        .single();

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      hasPassword = updatedProfile?.password_set || false;
    } else {
      // Create new profile (password not set yet)
      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          ...profileData,
          password_set: false,
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
        });
      }

      profileId = newProfile.id;
      hasPassword = false;
    }

    // Step 7: Return success with plan details
    return res.status(200).json({
      success: true,
      message: "Credential key redeemed successfully!",
      profileId,
      hasPassword,
      planDetails: {
        planName: keyData.plans?.name || "Unknown",
        billingCycle: keyData.plans?.billing_cycle || "monthly",
        expiresAt: keyData.expires_at,
        features: keyData.plans?.features || [],
      },
    });
  } catch (error) {
    console.error("Redeem credential key error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
