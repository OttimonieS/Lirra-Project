import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
function verifyAdminKey(req: VercelRequest): boolean {
  const apiKey = req.headers["x-api-key"] as string;
  return apiKey === process.env.ADMIN_API_KEY;
}

export async function deactivateToken(req: VercelRequest, res: VercelResponse) {
  if (!verifyAdminKey(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, reason } = req.body;

  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const { data, error } = await supabase
      .from("tokens")
      .update({
        status: "revoked",
        revoked_at: new Date().toISOString(),
        revoke_reason: reason || "Admin action",
      })
      .eq("token_hash", hashedToken)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Token not found" });
    }
    await supabase.from("admin_logs").insert({
      log_id: crypto.randomUUID(),
      action: "deactivate_token",
      token_hash: hashedToken,
      reason: reason,
      performed_at: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Token deactivated successfully",
      token: {
        planType: data.plan_type,
        userEmail: data.user_email,
        status: data.status,
      },
    });
  } catch (err) {
    console.error("Deactivate token error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function viewAllUsers(req: VercelRequest, res: VercelResponse) {
  if (!verifyAdminKey(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page, limit, planType, status, search } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from("dashboard_users")
      .select("*, tokens!inner(plan_type, status, expires_at)", {
        count: "exact",
      });

    if (planType) {
      query = query.eq("tokens.plan_type", planType);
    }

    if (status) {
      query = query.eq("tokens.status", status);
    }

    if (search) {
      query = query.ilike("email", `%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error("View all users error:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    return res.status(200).json({
      success: true,
      users: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("View all users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUserDetails(req: VercelRequest, res: VercelResponse) {
  if (!verifyAdminKey(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const { data: user, error: userError } = await supabase
      .from("dashboard_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { data: stores } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", userId);
    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId);

    const { data: photoJobs } = await supabase
      .from("photo_jobs")
      .select("job_id")
      .eq("user_id", userId);

    const totalIncome =
      transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    const totalExpenses =
      transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    return res.status(200).json({
      success: true,
      user: user,
      stores: stores || [],
      usage: {
        storesCount: stores?.length || 0,
        photosProcessed: photoJobs?.length || 0,
        totalTransactions: transactions?.length || 0,
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
      },
    });
  } catch (err) {
    console.error("Get user details error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function manageEnterpriseClients(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!verifyAdminKey(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { page, limit } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;
  const offset = (pageNum - 1) * limitNum;

  try {
    const { data, error, count } = await supabase
      .from("dashboard_users")
      .select("*, tokens!inner(plan_type, expires_at, status)", {
        count: "exact",
      })
      .eq("plan_type", "enterprise")
      .order("created_at", { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error("Manage enterprise clients error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch enterprise clients" });
    }

    return res.status(200).json({
      success: true,
      clients: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("Manage enterprise clients error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSystemStats(req: VercelRequest, res: VercelResponse) {
  if (!verifyAdminKey(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data: users } = await supabase
      .from("dashboard_users")
      .select("plan_type");

    const planCounts = {
      starter: users?.filter((u) => u.plan_type === "starter").length || 0,
      professional:
        users?.filter((u) => u.plan_type === "professional").length || 0,
      enterprise:
        users?.filter((u) => u.plan_type === "enterprise").length || 0,
    };
    const { data: tokens } = await supabase.from("tokens").select("status");

    const tokenStats = {
      active: tokens?.filter((t) => t.status === "active").length || 0,
      expired: tokens?.filter((t) => t.status === "expired").length || 0,
      revoked: tokens?.filter((t) => t.status === "revoked").length || 0,
    };
    const { data: payments } = await supabase
      .from("payment_records")
      .select("amount, status");

    const totalRevenue =
      payments
        ?.filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
    const { data: photoJobs } = await supabase
      .from("photo_jobs")
      .select("job_id");

    const { data: labels } = await supabase
      .from("generated_labels")
      .select("label_id");

    const { data: chatLogs } = await supabase
      .from("chat_logs")
      .select("log_id");

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: users?.length || 0,
        usersByPlan: planCounts,
        tokens: tokenStats,
        revenue: {
          total: totalRevenue,
          paymentsCount:
            payments?.filter((p) => p.status === "completed").length || 0,
        },
        featureUsage: {
          photosProcessed: photoJobs?.length || 0,
          labelsGenerated: labels?.length || 0,
          aiRepliesGenerated: chatLogs?.length || 0,
        },
      },
    });
  } catch (err) {
    console.error("Get system stats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function extendTokenExpiration(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!verifyAdminKey(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, daysToAdd, reason } = req.body;

  if (!token || !daysToAdd) {
    return res.status(400).json({ error: "token and daysToAdd are required" });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const { data: tokenData } = await supabase
      .from("tokens")
      .select("expires_at")
      .eq("token_hash", hashedToken)
      .single();

    if (!tokenData) {
      return res.status(404).json({ error: "Token not found" });
    }

    const currentExpiry = new Date(tokenData.expires_at);
    const newExpiry = new Date(
      currentExpiry.getTime() + daysToAdd * 24 * 60 * 60 * 1000
    );

    const { error } = await supabase
      .from("tokens")
      .update({
        expires_at: newExpiry.toISOString(),
        status: "active",
      })
      .eq("token_hash", hashedToken);

    if (error) {
      return res.status(500).json({ error: "Failed to extend token" });
    }
    await supabase.from("admin_logs").insert({
      log_id: crypto.randomUUID(),
      action: "extend_token",
      token_hash: hashedToken,
      reason: reason || `Extended by ${daysToAdd} days`,
      performed_at: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Token expiration extended successfully",
      newExpiry: newExpiry.toISOString(),
    });
  } catch (err) {
    console.error("Extend token error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}