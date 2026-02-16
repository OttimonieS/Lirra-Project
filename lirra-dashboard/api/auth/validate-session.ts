import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface ValidateSessionRequest {
  token: string;
  userId?: string;
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "*"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      valid: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Method not allowed",
    });
  }

  const { token, userId }: ValidateSessionRequest = req.body;

  if (!token) {
    return res.status(400).json({
      valid: false,
      error: "MISSING_TOKEN",
      message: "Token is required",
    });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("*")
      .eq("token_hash", hashedToken)
      .single();

    if (tokenError || !tokenData) {
      return res.status(404).json({
        valid: false,
        error: "INVALID_TOKEN",
        message: "Token not found",
      });
    }
    if (tokenData.status !== "active") {
      return res.status(400).json({
        valid: false,
        error: "TOKEN_NOT_ACTIVE",
        message: `Token is ${tokenData.status}`,
      });
    }
    const expirationDate = new Date(tokenData.expires_at);
    const now = new Date();

    if (expirationDate < now) {
      await supabase
        .from("tokens")
        .update({ status: "expired" })
        .eq("token_hash", hashedToken);

      return res.status(400).json({
        valid: false,
        error: "EXPIRED_TOKEN",
        message: "Token has expired",
      });
    }
    const usage = {
      storesUsed: 0,
      photosProcessed: 0,
      apiCallsUsed: 0,
    };

    if (userId) {
      const { data: stores } = await supabase
        .from("stores")
        .select("store_id")
        .eq("user_id", userId);
      usage.storesUsed = stores?.length || 0;
      const { data: photoJobs } = await supabase
        .from("photo_jobs")
        .select("job_id")
        .eq("user_id", userId);
      usage.photosProcessed = photoJobs?.length || 0;
      const { data: apiUsage } = await supabase
        .from("usage_tracking")
        .select("api_calls")
        .eq("user_id", userId)
        .single();
      usage.apiCallsUsed = apiUsage?.api_calls || 0;
    }
    return res.status(200).json({
      valid: true,
      planDetails: {
        planType: tokenData.plan_type,
        planName:
          tokenData.plan_type.charAt(0).toUpperCase() +
          tokenData.plan_type.slice(1),
        expiresAt: tokenData.expires_at,
        allowedFeatures: tokenData.metadata?.features || [],
        limits: tokenData.metadata?.limits || {
          stores: 1,
          photos: "unlimited",
          apiCalls: 1000,
          users: 1,
        },
      },
      usage,
    });
  } catch (err) {
    console.error("Session validation error:", err);
    return res.status(500).json({
      valid: false,
      error: "SERVER_ERROR",
      message: "Internal server error",
    });
  }
}