/**
 * Link Profile to Auth User API
 * POST /api/auth/link-profile
 *
 * Links existing profile (created during redemption) with Supabase auth user
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LinkProfileRequest {
  profile_id: string;
  auth_user_id: string;
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

  const { profile_id, auth_user_id }: LinkProfileRequest = req.body;

  if (!profile_id || !auth_user_id) {
    return res.status(400).json({
      success: false,
      error: "profile_id and auth_user_id are required",
    });
  }

  try {
    // Update profile with auth_user_id and mark password as set
    const { data, error } = await supabase
      .from("profiles")
      .update({
        auth_user_id: auth_user_id,
        password_set: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile_id)
      .select()
      .single();

    if (error) {
      console.error("Error linking profile:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to link profile to user account",
      });
    }

    return res.status(200).json({
      success: true,
      profile: data,
    });
  } catch (error) {
    console.error("Error in link-profile handler:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
